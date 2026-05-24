'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { deleteToken } from 'firebase/messaging';
import { useSession } from 'next-auth/react';
import { getFirebaseMessaging } from '@/lib/firebase';
import { FCM_MESSAGES } from './fcm-constants';
import { clearDeniedToastFlag } from './fcm-denied-toast';
import { teardownForegroundListener } from './fcm-listener';

interface UseFcmLogoutCleanupOptions {
   registeredTokenRef: MutableRefObject<string | null>;
   resetState: () => void;
}

/**
 * Runs once on every authenticated → unauthenticated transition:
 *   - Delete the FCM token client-side so pushes stop targeting this user.
 *   - Tear down the foreground listener singleton.
 *   - Reset refs + state in the init hook.
 *   - Clear the denied-toast flag so it can re-show on next login if needed.
 *
 * TODO(backend): also call an unregister-device endpoint to drop the row
 * server-side.
 */
export function useFcmLogoutCleanup({
   registeredTokenRef,
   resetState,
}: UseFcmLogoutCleanupOptions): void {
   const { status } = useSession();
   const prevStatusRef = useRef(status);

   useEffect(() => {
      const prev = prevStatusRef.current;
      prevStatusRef.current = status;

      if (prev !== 'authenticated' || status === 'authenticated') return;

      const messaging = getFirebaseMessaging();
      if (messaging) {
         deleteToken(messaging).catch((err) => {
            console.warn(FCM_MESSAGES.DELETE_TOKEN_FAILED, err);
         });
      }

      teardownForegroundListener();
      registeredTokenRef.current = null;
      resetState();
      clearDeniedToastFlag();
   }, [status, registeredTokenRef, resetState]);
}
