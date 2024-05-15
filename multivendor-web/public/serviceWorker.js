

importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js");

import { precacheAndRoute } from 'workbox-precaching';




firebase.initializeApp({
  apiKey: "AIzaSyDx_iSQ9LroTF7NMm20aRvw2wJqhwSnJ3U",
  authDomain: "enatega-multivender-web.firebaseapp.com",
  projectId: "enatega-multivender-web",
  storageBucket: "enatega-multivender-web.appspot.com",
  messagingSenderId: "438532750182",
  appId: "1:438532750182:web:516b850eff4e0349f0a6a7",
  measurementId: 'G-KLBJSEHRYQ',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  
  console.log(" message recieved ",payload)
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/192.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

precacheAndRoute(self.__WB_MANIFEST);





self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const redirectUrl = event.notification.data?.redirectUrl;

  if (redirectUrl) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === redirectUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirectUrl);
        }
      })
    );
  }
})



















