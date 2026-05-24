'use client';

import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { getToken } from 'firebase/messaging';
import { useSession } from 'next-auth/react';
import { getFirebaseMessaging } from '@/lib/firebase';
import { setAuthToken } from '@/lib/axios';
import { FCM_MESSAGES, VAPID_KEY } from './fcm-constants';
import { showDeniedToastOnce } from './fcm-denied-toast';
import { ensureForegroundListener } from './fcm-listener';
import { sendFcmTokenToServer } from './fcm-register-device';
import { registerAndWaitForActive } from './fcm-service-worker';

export interface UseFcmInitReturn {
   token: string | null;
   permissionStatus: NotificationPermission | null;
   error: Error | null;
   /** Set when reset by the logout-cleanup hook. */
   resetState: () => void;
   /** Exposed so the cleanup hook can drop the last-registered token. */
   registeredTokenRef: MutableRefObject<string | null>;
}

/**
 * Runs the full FCM init chain on every authenticated session:
 *   1. Request notification permission (show denied-toast if rejected).
 *   2. Register the SW and wait for activation.
 *   3. Acquire an FCM token.
 *   4. Wire up the foreground listener (singleton).
 *   5. POST the token to the backend if it's new.
 *
 * The whole chain shares a single `cancelled` flag so a session change cleanly
 * aborts in-flight work without leaving partial state.
 */
export function useFcmInit(): UseFcmInitReturn {
   const [token, setToken] = useState<string | null>(null);
   const [permissionStatus, setPermissionStatus] =
      useState<NotificationPermission | null>(null);
   const [error, setError] = useState<Error | null>(null);

   const { data: session, status } = useSession();
   const accessToken = session?.user?.accessToken ?? null;

   // Tracks the token last successfully registered with the backend. null =
   // never registered. If sendFcmTokenToServer fails this stays null and the
   // next effect run automatically retries.
   const registeredTokenRef = useRef<string | null>(null);

   useEffect(() => {
      if (status !== 'authenticated') return;
      // Wait for the access token to be in the session — otherwise the
      // device-register POST can race ahead of useAuthToken's sync and ship
      // without a Bearer header → 401.
      if (!accessToken) return;
      if (typeof window === 'undefined') return;

      // FCMProvider lives in the root layout, but useAuthToken is only mounted
      // in nested layouts. Sync here so the device-register POST always has a
      // Bearer header, even on pages (e.g. landing) that don't mount it.
      setAuthToken(accessToken);

      if (!('Notification' in window)) {
         console.warn(FCM_MESSAGES.UNSUPPORTED);
         return;
      }
      if (!VAPID_KEY) {
         console.warn(FCM_MESSAGES.MISSING_VAPID);
         return;
      }

      let cancelled = false;

      const init = async () => {
         try {
            const permission = await Notification.requestPermission();
            if (cancelled) return;
            setPermissionStatus(permission);

            if (permission !== 'granted') {
               if (permission === 'denied') showDeniedToastOnce();
               return;
            }

            const messaging = getFirebaseMessaging();
            if (!messaging) throw new Error(FCM_MESSAGES.MISSING_MESSAGING);

            const swRegistration = await registerAndWaitForActive();
            if (cancelled) return;

            const fcmToken = await getToken(messaging, {
               vapidKey: VAPID_KEY,
               serviceWorkerRegistration: swRegistration,
            });
            if (cancelled) return;

            if (!fcmToken) {
               console.warn(FCM_MESSAGES.NO_TOKEN);
               return;
            }

            setToken(fcmToken);

            // Register the foreground listener BEFORE the backend POST. If the
            // POST throws (transient 401/network), we still want foreground
            // toasts to work for tokens registered in earlier sessions.
            ensureForegroundListener(messaging);

            // Skip POST if the backend already knows this token. If the POST
            // fails, registeredTokenRef stays at the previous value so the
            // next effect run (next sign-in, re-mount) retries.
            if (registeredTokenRef.current !== fcmToken) {
               await sendFcmTokenToServer(fcmToken);
               registeredTokenRef.current = fcmToken;
            }
         } catch (err) {
            if (cancelled) return;
            const caught =
               err instanceof Error
                  ? err
                  : new Error('FCM initialization failed');
            console.error(FCM_MESSAGES.INIT_FAILED, caught.message);
            setError(caught);
         }
      };

      init();

      return () => {
         cancelled = true;
      };
   }, [status, accessToken]);

   const resetState = () => {
      setToken(null);
      setError(null);
   };

   return {
      token,
      permissionStatus,
      error,
      resetState,
      registeredTokenRef,
   };
}
