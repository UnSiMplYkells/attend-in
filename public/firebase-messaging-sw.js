importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyCB0gQHtDe4z0b3g80knI_J5t68mqVNanQ",
  authDomain: "fcm-for-attendin.firebaseapp.com",
  projectId: "fcm-for-attendin",
  storageBucket: "fcm-for-attendin.firebasestorage.app",
  messagingSenderId: "71690818372",
  appId: "1:71690818372:web:cb63bba9336f0b897fbd11",
  measurementId: "G-P4BGS4YJMB",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload,
//   );

//   // payload.fcmOptions?.link comes from our backend API route handle
//   // payload.data.link comes from the Firebase Console where link is the 'key'
//   const link = payload.fcmOptions?.link || payload.data?.link;

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "./logo.png",
//     data: { url: link },
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background data message ",
      payload,
    );

    // Since we use data-only payloads, everything lives inside payload.data
    const notificationTitle = payload.data.title;
    const link = payload.data.link || "/";

    const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.icon || "./logo.png",
      data: { url: link },
    };

    // This is now the ONLY notification that will render
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions,
    );
  });

self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  event.waitUntil(
    clients
      // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) return;

        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          console.log("OPENWINDOW ON CLIENT");
          return clients.openWindow(url);
        }
      }),
  );
});
