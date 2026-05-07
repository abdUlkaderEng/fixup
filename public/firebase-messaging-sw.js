// =============================================================
// Firebase Messaging Service Worker — Background Notifications
// =============================================================
// NOTE: Service workers MUST be plain .js files.
// Browsers execute them directly — no TypeScript/webpack transpilation.
// This is a browser platform constraint, not a project choice.
// =============================================================
// هذا الملف يعمل خارج webpack ولا يمكنه قراءة process.env
// استبدل قيم TODO أدناه بقيمك الفعلية من Firebase Console
// =============================================================

importScripts(
   'https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js'
);
importScripts(
   'https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js'
);

// TODO: استبدل هذه القيم بالقيم الفعلية من Firebase Console
// (هي متغيرات NEXT_PUBLIC_ عامة — لا خطر أمني في تضمينها هنا)
const firebaseConfig = {
   apiKey: 'AIzaSyACXfzTll68-rbX7Q0qd7UCf96RroDJqyU',
   authDomain: 'fixup-c687c.firebaseapp.com',
   projectId: 'fixup-c687c',
   storageBucket: 'fixup-c687c.firebasestorage.app',
   messagingSenderId: '43823771068',
   appId: '1:43823771068:web:d9bc0f522b0501b23e4fb9',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// الإشعارات في الخلفية — عندما تكون الصفحة مغلقة أو غير نشطة
messaging.onBackgroundMessage(function (payload) {
   console.log(
      '[firebase-messaging-sw.js] Background message received:',
      payload
   );

   const notificationTitle =
      payload.notification?.title ?? 'إشعار جديد من FIXUP';
   const notificationOptions = {
      body: payload.notification?.body ?? '',
      icon: payload.notification?.icon ?? '/LOGO.svg',
      badge: '/LOGO.svg',
      tag: payload.data?.tag ?? 'fixup-notification',
      data: payload.data ?? {},
   };

   return self.registration.showNotification(
      notificationTitle,
      notificationOptions
   );
});

// توجيه المستخدم عند النقر على الإشعار
self.addEventListener('notificationclick', function (event) {
   event.notification.close();

   const urlToOpen = event.notification.data?.url ?? '/';

   event.waitUntil(
      clients
         .matchAll({ type: 'window', includeUncontrolled: true })
         .then(function (clientList) {
            for (const client of clientList) {
               if (
                  client.url.includes(self.location.origin) &&
                  'focus' in client
               ) {
                  client.focus();
                  client.navigate(urlToOpen);
                  return;
               }
            }
            if (clients.openWindow) {
               return clients.openWindow(urlToOpen);
            }
         })
   );
});
