import { SERVICE_WORKER_PATH } from './fcm-constants';

/**
 * Registers the Firebase messaging service worker and resolves once it has
 * reached the "activated" state.
 *
 * Without waiting for activation, `getToken()` may run before the SW controls
 * the page and Firebase falls back to a token that doesn't match the active
 * SW, causing background notifications to silently fail.
 */
export async function registerAndWaitForActive(): Promise<ServiceWorkerRegistration> {
   const registration =
      await navigator.serviceWorker.register(SERVICE_WORKER_PATH);

   const isAlreadyActive =
      registration.active && !registration.installing && !registration.waiting;

   if (isAlreadyActive) return registration;

   await new Promise<void>((resolve) => {
      const sw =
         registration.installing ?? registration.waiting ?? registration.active;
      sw?.addEventListener('statechange', function handler(e) {
         if ((e.target as ServiceWorker).state === 'activated') {
            sw.removeEventListener('statechange', handler);
            resolve();
         }
      });
   });

   return registration;
}
