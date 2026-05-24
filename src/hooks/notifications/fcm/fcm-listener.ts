import {
   onMessage,
   type Messaging,
   type MessagePayload,
} from 'firebase/messaging';
import { toast } from 'sonner';
import { dispatchFcmMessage } from '@/lib/notification-events';
import { FALLBACK_NOTIFICATION_TITLE } from './fcm-constants';

// Module-level singleton: the onMessage listener must outlive component
// re-renders and React Strict Mode double-mounts. Once registered it stays
// alive for the session.
let foregroundUnsubscribe: (() => void) | null = null;

function handleForegroundMessage(payload: MessagePayload): void {
   const title = payload.notification?.title ?? FALLBACK_NOTIFICATION_TITLE;
   const description = payload.notification?.body;

   toast(title, { description });
   dispatchFcmMessage({
      title,
      body: description,
      data: payload.data,
   });
}

export function ensureForegroundListener(messaging: Messaging): void {
   if (foregroundUnsubscribe) return;
   foregroundUnsubscribe = onMessage(messaging, handleForegroundMessage);
}

export function teardownForegroundListener(): void {
   if (!foregroundUnsubscribe) return;
   foregroundUnsubscribe();
   foregroundUnsubscribe = null;
}
