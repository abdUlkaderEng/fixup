import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const REQUIRED_KEYS = [
   'apiKey',
   'authDomain',
   'projectId',
   'storageBucket',
   'messagingSenderId',
   'appId',
] as const;

type ConfigKey = (typeof REQUIRED_KEYS)[number];

function isConfigComplete(): boolean {
   const missing = REQUIRED_KEYS.filter(
      (key) => !firebaseConfig[key as ConfigKey]
   );
   if (missing.length > 0) {
      console.warn(
         '[Firebase] Missing environment variables:',
         missing
            .map(
               (k) =>
                  `NEXT_PUBLIC_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`
            )
            .join(', ')
      );
      return false;
   }
   return true;
}

// Singleton — getApps() prevents re-init on HMR
function initFirebaseApp(): FirebaseApp | null {
   if (!isConfigComplete()) return null;
   return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

let app: FirebaseApp | null = null;
if (typeof window !== 'undefined') {
   app = initFirebaseApp();
}

export { app };

export function getFirebaseMessaging(): Messaging | null {
   if (typeof window === 'undefined') return null;
   if (!app) {
      console.warn(
         '[Firebase] App not initialized. Check environment variables.'
      );
      return null;
   }
   try {
      return getMessaging(app);
   } catch (error) {
      console.error('[Firebase] Failed to get messaging instance:', error);
      return null;
   }
}
