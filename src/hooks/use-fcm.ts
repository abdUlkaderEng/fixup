'use client';

import { useEffect, useRef, useState } from 'react';
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import { toast } from 'sonner';
import { getFirebaseMessaging } from '@/lib/firebase';
import { notificationsApi } from '@/api/notifications';
import { dispatchFcmMessage } from '@/lib/notification-events';
import { useSession } from 'next-auth/react';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

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
      device_type: null,
   });
}

export function useFCM(): UseFCMReturn {
   const [token, setToken] = useState<string | null>(null);
   const [permissionStatus, setPermissionStatus] =
      useState<NotificationPermission | null>(null);
   const [error, setError] = useState<Error | null>(null);

   const { status } = useSession();

   const hasRegistered = useRef(false);

   useEffect(() => {
      if (status !== 'authenticated') return;
      if (typeof window === 'undefined') return;
      if (!('Notification' in window)) {
         console.warn('[useFCM] هذا المتصفح لا يدعم الإشعارات.');
         return;
      }
      if (!VAPID_KEY) {
         console.warn(
            '[useFCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY غير محدد في ملف البيئة.'
         );
      }

      let cancelled = false;

      const initFCM = async () => {
         try {
            const permission = await Notification.requestPermission();
            if (cancelled) return;
            setPermissionStatus(permission);

            if (permission !== 'granted') return;

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

            if (!hasRegistered.current) {
               hasRegistered.current = true;
               await sendTokenToServer(fcmToken);
            }
            if (cancelled) return;

            // Register the foreground message listener only once (module-level singleton).
            // This prevents Strict Mode double-mount from destroying and re-creating the listener,
            // which would leave a window where FCM messages are silently dropped.
            if (!foregroundListenerUnsubscribe) {
               foregroundListenerUnsubscribe = onMessage(
                  messaging,
                  (payload: MessagePayload) => {
                     const title =
                        payload.notification?.title ?? 'إشعار جديد من FIXUP';
                     const description = payload.notification?.body;

                     toast(title, { description });
                     dispatchFcmMessage({ title, body: description });
                  }
               );
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
         // Only cancel state updates — do NOT unsubscribe the singleton onMessage listener
         cancelled = true;
      };
   }, [status]);

   return { token, permissionStatus, error };
}

export default useFCM;
