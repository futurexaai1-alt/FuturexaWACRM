importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// We use self.location.search to pass the firebase config to the service worker during registration.
// Alternatively, hardcode the config here if environment variables are tricky.
// Since it's a static file, we can't use process.env directly.
// We will initialize it when we register the worker.

let messaging = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const firebaseConfig = event.data.config;
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();
    
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico',
        data: payload.data, // Contains the URL to open
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
