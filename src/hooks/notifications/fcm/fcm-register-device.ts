import { notificationsApi } from '@/api/notifications';

export async function sendFcmTokenToServer(fcmToken: string): Promise<void> {
   await notificationsApi.registerDevice({
      fcm_token: fcmToken,
      device_type: 'web',
   });
}
