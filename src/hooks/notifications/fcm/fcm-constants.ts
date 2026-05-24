export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
export const DENIED_TOAST_KEY = 'fcm-denied-toasted';
export const SERVICE_WORKER_PATH = '/firebase-messaging-sw.js';
export const FALLBACK_NOTIFICATION_TITLE = 'إشعار جديد من FIXUP';

export const FCM_MESSAGES = {
   UNSUPPORTED: ' هذا المتصفح لا يدعم الإشعارات.',
   MISSING_VAPID:
      '[useFCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY غير محدد. تخطي تهيئة FCM.',
   MISSING_MESSAGING:
      'Firebase Messaging لم يتم تهيئته. تحقق من متغيرات البيئة.',
   NO_TOKEN: '[useFCM] لم يتم الحصول على توكن FCM. تحقق من إعدادات VAPID.',
   DELETE_TOKEN_FAILED: '[useFCM] فشل حذف توكن FCM:',
   INIT_FAILED: '[useFCM] خطأ في تهيئة FCM:',
   DENIED_TITLE: 'الإشعارات معطلة',
   DENIED_DESCRIPTION:
      'لن تتلقى إشعارات جديدة. يمكنك تفعيلها من إعدادات المتصفح.',
} as const;
