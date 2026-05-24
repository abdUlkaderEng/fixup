import { toast } from 'sonner';
import { DENIED_TOAST_KEY, FCM_MESSAGES } from './fcm-constants';

/**
 * Shows the "notifications denied" warning once per session.
 * No-op in SSR (no sessionStorage).
 */
export function showDeniedToastOnce(): void {
   if (typeof sessionStorage === 'undefined') return;
   if (sessionStorage.getItem(DENIED_TOAST_KEY)) return;

   toast.warning(FCM_MESSAGES.DENIED_TITLE, {
      description: FCM_MESSAGES.DENIED_DESCRIPTION,
   });
   sessionStorage.setItem(DENIED_TOAST_KEY, '1');
}

export function clearDeniedToastFlag(): void {
   if (typeof sessionStorage === 'undefined') return;
   sessionStorage.removeItem(DENIED_TOAST_KEY);
}
