'use client';

import { useFcmInit, useFcmLogoutCleanup } from './fcm';

export interface UseFCMReturn {
   token: string | null;
   permissionStatus: NotificationPermission | null;
   error: Error | null;
}

export function useFCM(): UseFCMReturn {
   const { token, permissionStatus, error, resetState, registeredTokenRef } =
      useFcmInit();

   useFcmLogoutCleanup({ registeredTokenRef, resetState });

   return { token, permissionStatus, error };
}
