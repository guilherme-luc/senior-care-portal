import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// TODO: Substitua pelas configurações reais do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSOnJm8dxLLMLRATWjCZAMQrTEeJKiIIU",
  authDomain: "senior-care-portal.firebaseapp.com",
  projectId: "senior-care-portal",
  storageBucket: "senior-care-portal.firebasestorage.app",
  messagingSenderId: "566385411278",
  appId: "1:566385411278:web:bc0007a31bba9deebcbc9f",
  measurementId: "G-55FX9CF4YY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// FCM só funciona no navegador, não no Node (ex: SSR). Garantindo segurança:
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export default app;
