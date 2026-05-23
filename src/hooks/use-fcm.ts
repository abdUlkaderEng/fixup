'use client';

import { useEffect, useRef, useState } from 'react';
import {
   deleteToken,
   getToken,
   onMessage,
   type MessagePayload,
} from 'firebase/messaging';
import { toast } from 'sonner';
import { getFirebaseMessaging } from '@/lib/firebase';
import { notificationsApi } from '@/api/notifications';
import { dispatchFcmMessage } from '@/lib/notification-events';
import { useSession } from 'next-auth/react';
import { setAuthToken } from '@/lib/axios';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const DENIED_TOAST_KEY = 'fcm-denied-toasted';

// Module-level singleton: the onMessage listener must outlive component re-renders
// and React Strict Mode double-mounts. Once registered it stays alive for the session.
let foregroundListenerUnsubscribe: (() => void) | null = null;

export interface UseFCMReturn {
   token: string | null;
   permissionStatus: NotificationPermission | null;
   error: Error | null;
}

async function sendTokenToServer(fcmToken: string): Promise<void> {
   await notificationsApi.registerDevice({
      fcm_token: fcmToken,
      device_type: 'web',
   });
}

export function useFCM(): UseFCMReturn {
   const [token, setToken] = useState<string | null>(null);
   const [permissionStatus, setPermissionStatus] =
      useState<NotificationPermission | null>(null);
   const [error, setError] = useState<Error | null>(null);

   const { data: session, status } = useSession();
   const accessToken = session?.user?.accessToken ?? null;

   // Track the token we last successfully registered with the backend.
   // null = never registered yet. If sendTokenToServer fails, this stays null
   // and the next effect run retries automatically.
   const registeredTokenRef = useRef<string | null>(null);
   const prevStatusRef = useRef(status);

   // Token-acquisition + registration effect
   useEffect(() => {
      if (status !== 'authenticated') return;
      // Wait for the session's access token to be available. Without this,
      // the device-register POST can race ahead of useAuthToken's sync to
      // the axios client and go out without a Bearer header → 401.
      if (!accessToken) return;
      if (typeof window === 'undefined') return;

      // FCMProvider lives in the root layout, but useAuthToken is only mounted
      // in nested layouts. Sync here so the device-register POST always has a
      // Bearer header, even on pages (e.g., landing) that don't mount it.
      setAuthToken(accessToken);
      if (!('Notification' in window)) {
         console.warn('[useFCM] هذا المتصفح لا يدعم الإشعارات.');
         return;
      }
      if (!VAPID_KEY) {
         console.warn(
            '[useFCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY غير محدد. تخطي تهيئة FCM.'
         );
         return;
      }

      let cancelled = false;

      const initFCM = async () => {
         try {
            const permission = await Notification.requestPermission();
            if (cancelled) return;
            setPermissionStatus(permission);

            if (permission !== 'granted') {
               if (
                  permission === 'denied' &&
                  typeof sessionStorage !== 'undefined' &&
                  !sessionStorage.getItem(DENIED_TOAST_KEY)
               ) {
                  toast.warning('الإشعارات معطلة', {
                     description:
                        'لن تتلقى إشعارات جديدة. يمكنك تفعيلها من إعدادات المتصفح.',
                  });
                  sessionStorage.setItem(DENIED_TOAST_KEY, '1');
               }
               return;
            }

            const messaging = getFirebaseMessaging();
            if (!messaging) {
               throw new Error(
                  'Firebase Messaging لم يتم تهيئته. تحقق من متغيرات البيئة.'
               );
            }

            const swRegistration = await navigator.serviceWorker.register(
               '/firebase-messaging-sw.js'
            );

            // Wait for the SW to move past "installing" into "activated".
            // Without this, getToken() may run before the SW controls the page
            // and Firebase falls back to a token that doesn't match the active SW,
            // causing background notifications to silently fail.
            await new Promise<void>((resolve) => {
               const sw =
                  swRegistration.installing ??
                  swRegistration.waiting ??
                  swRegistration.active;
               if (
                  swRegistration.active &&
                  !swRegistration.installing &&
                  !swRegistration.waiting
               ) {
                  resolve();
                  return;
               }
               sw?.addEventListener('statechange', function handler(e) {
                  if ((e.target as ServiceWorker).state === 'activated') {
                     sw.removeEventListener('statechange', handler);
                     resolve();
                  }
               });
            });

            if (cancelled) return;

            const fcmToken = await getToken(messaging, {
               vapidKey: VAPID_KEY,
               serviceWorkerRegistration: swRegistration,
            });
            if (cancelled) return;

            if (!fcmToken) {
               console.warn(
                  '[useFCM] لم يتم الحصول على توكن FCM. تحقق من إعدادات VAPID.'
               );
               return;
            }

            setToken(fcmToken);

            // Register the foreground message listener BEFORE the backend POST.
            // If sendTokenToServer throws (e.g., transient 401/network), we still
            // want foreground toasts to work for tokens already registered on
            // earlier sessions. Module-level singleton guards against Strict Mode
            // double-mount destroying and re-creating the listener.
            if (!foregroundListenerUnsubscribe) {
               foregroundListenerUnsubscribe = onMessage(
                  messaging,
                  (payload: MessagePayload) => {
                     const title =
                        payload.notification?.title ?? 'إشعار جديد من FIXUP';
                     const description = payload.notification?.body;

                     toast(title, { description });
                     dispatchFcmMessage({
                        title,
                        body: description,
                        data: payload.data,
                     });
                  }
               );
            }

            // Register only if this token is new to the backend.
            // If the POST fails, registeredTokenRef stays at its previous value
            // so the next effect run (e.g., next sign-in, re-mount) will retry.
            if (registeredTokenRef.current !== fcmToken) {
               await sendTokenToServer(fcmToken);
               registeredTokenRef.current = fcmToken;
            }
         } catch (err) {
            if (cancelled) return;
            const caught =
               err instanceof Error
                  ? err
                  : new Error('FCM initialization failed');
            console.error('[useFCM] خطأ في تهيئة FCM:', caught.message);
            setError(caught);
         }
      };

      initFCM();

      return () => {
         cancelled = true;
      };
   }, [status, accessToken]);

   // Logout cleanup: when the session transitions away from authenticated,
   // delete the FCM token client-side so future pushes for this user stop.
   // TODO(backend): also call an unregister-device endpoint to drop the row server-side.
   useEffect(() => {
      const prev = prevStatusRef.current;
      prevStatusRef.current = status;

      if (prev !== 'authenticated' || status === 'authenticated') return;

      const messaging = getFirebaseMessaging();
      if (messaging) {
         deleteToken(messaging).catch((err) => {
            console.warn('[useFCM] فشل حذف توكن FCM:', err);
         });
      }

      if (foregroundListenerUnsubscribe) {
         foregroundListenerUnsubscribe();
         foregroundListenerUnsubscribe = null;
      }

      registeredTokenRef.current = null;
      setToken(null);
      setError(null);

      if (typeof sessionStorage !== 'undefined') {
         sessionStorage.removeItem(DENIED_TOAST_KEY);
      }
   }, [status]);

   return { token, permissionStatus, error };
}

export default useFCM;
