// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { onBackgroundMessage, onMessage as onMessageSW } from 'firebase/messaging/sw';

// const messaging = getMessaging();

// (async function () {
//   await getToken(messaging, {
//     vapidKey: 'BEzJ0Spne0WLLV-Wx5bMCr5F2-1Q2BRI2VbKep8Dmph84BQfQgr_kG_LSAnBqNc4_F4T2IUHoycS3hhFoeZtB8U',
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         this.token = currentToken;
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//       }
//     })
//     .catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//     });
// })();

// onBackgroundMessage(messaging, (payload) => {
//   console.log('Message345 received. ', payload);
//   const notificationTitle = 'Message';
//   const notificationOptions = {
//     body: 'Message',
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

// onMessage(messaging, (payload) => {
//   console.log('Message321 received. ', payload);
//   const notificationTitle = 'Message';
//   const notificationOptions = {
//     body: 'Message',
//     icon: '/firebase-logo.png',
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

// onMessageSW(messaging, (payload) => {
//   console.log('Message123 received. ', payload);
//   const notificationTitle = 'Message';
//   const notificationOptions = {
//     body: 'Message',
//     icon: '/firebase-logo.png',
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener('push', async function (event) {
//   console.log('Push Received.', event);
//   event.waitUntil(
//     self.registration.showNotification('title', {
//       body: 'body',
//     }),
//   );
// });

// self.addEventListener('message', (event) => {
//   console.log('Message Received.', event);
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });
