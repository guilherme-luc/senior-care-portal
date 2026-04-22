importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBSOnJm8dxLLMLRATWjCZAMQrTEeJKiIIU",
  authDomain: "senior-care-portal.firebaseapp.com",
  projectId: "senior-care-portal",
  storageBucket: "senior-care-portal.firebasestorage.app",
  messagingSenderId: "566385411278",
  appId: "1:566385411278:web:bc0007a31bba9deebcbc9f",
  measurementId: "G-55FX9CF4YY"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em background ', payload);
  const notificationTitle = payload.notification.title || 'Nova Notificação - Cuidado 360';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
