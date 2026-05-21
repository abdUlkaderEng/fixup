/**
 * Typed browser-event bus for FCM → notification hooks communication.
 *
 * When Firebase delivers a foreground message, useFCM dispatches
 * FCM_MESSAGE_EVENT. Any notification hook that needs to re-fetch
 * listens for this event and calls its own refetch().
 *
 * Using CustomEvent instead of a shared Zustand store or React context
 * keeps the three pieces (useFCM, useWorkerNotifications,
 * useCustomerNotifications) fully decoupled — no prop drilling,
 * no shared state, no provider wrapping required.
 */

export const FCM_MESSAGE_EVENT = 'fcm:message' as const;

export interface FcmMessageDetail {
   title: string;
   body?: string;
   data?: Record<string, string>;
}

export function dispatchFcmMessage(detail: FcmMessageDetail): void {
   if (typeof window === 'undefined') return;
   window.dispatchEvent(
      new CustomEvent<FcmMessageDetail>(FCM_MESSAGE_EVENT, { detail })
   );
}

export function onFcmMessage(
   handler: (detail: FcmMessageDetail) => void
): () => void {
   if (typeof window === 'undefined') return () => {};

   const listener = (e: Event) => {
      handler((e as CustomEvent<FcmMessageDetail>).detail);
   };

   window.addEventListener(FCM_MESSAGE_EVENT, listener);
   console.log('LISTNER TO NOTIFICATIONS');
   return () => window.removeEventListener(FCM_MESSAGE_EVENT, listener);
}
