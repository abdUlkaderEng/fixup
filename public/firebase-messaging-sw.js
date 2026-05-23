importScripts(
   'https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js'
);
importScripts(
   'https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js'
);

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

// استقبال الإشعارات في الخلفية (عندما يكون الموقع مغلقاً أو التبويب ليس في الواجهة)
messaging.onBackgroundMessage(function (payload) {
   console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
   );

   // نقرأ دائماً من كائن data الموحد والمضمون النقل
   const notificationTitle = payload.data?.title ?? 'إشعار جديد من FIXUP';

   const notificationOptions = {
      body: payload.data?.body ?? '',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: payload.data?.tag ?? 'fixup-notification', // يمنع تكرار نفس الإشعار
      data: {
         url: payload.data?.url ?? '/',
         type: payload.data?.type ?? 'general',
      },
   };

   // أمر إجباري للمتصفح لإظهار الإشعار على الشاشة فوراً
   return self.registration.showNotification(
      notificationTitle,
      notificationOptions
   );
});

// التعامل مع الضغط على الإشعار للتوجيه للرابط الصحيح
self.addEventListener('notificationclick', function (event) {
   event.notification.close();

   const urlToOpen = event.notification.data?.url ?? '/';
   const targetOrigin = self.location.origin;

   event.waitUntil(
      clients
         .matchAll({ type: 'window', includeUncontrolled: true })
         .then(function (clientList) {
            const sameOriginClients = clientList.filter(function (c) {
               try {
                  return new URL(c.url).origin === targetOrigin;
               } catch {
                  return false;
               }
            });

            const exactMatch = sameOriginClients.find(function (c) {
               try {
                  return new URL(c.url).pathname === urlToOpen;
               } catch {
                  return false;
               }
            });

            const chosen = exactMatch ?? sameOriginClients[0];
            if (chosen && 'focus' in chosen) {
               return chosen.focus().then(function () {
                  if (!exactMatch && 'navigate' in chosen) {
                     return chosen.navigate(urlToOpen);
                  }
               });
            }

            if (clients.openWindow) {
               return clients.openWindow(urlToOpen);
            }
         })
   );
});
