import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { IFirebaseConfig } from './lib/utils/interfaces';

export const initialize = (config: IFirebaseConfig): Messaging | null => {

  if (
    !config.FIREBASE_KEY ||
    !config.FIREBASE_AUTH_DOMAIN ||
    !config.FIREBASE_PROJECT_ID ||
    !config.FIREBASE_STORAGE_BUCKET ||
    !config.FIREBASE_MSG_SENDER_ID ||
    !config.FIREBASE_APP_ID ||
    !config.FIREBASE_MEASUREMENT_ID
  ) {
    console.error(
      '🔥 Missing Firebase configuration values. Firebase will not be initialized.'
    );
    return null; 
  }

  try {

    const existingApps = getApps();
    if (existingApps.length > 0) {
      return getMessaging(existingApps[0]); 
    }

    const firebaseConfig = {
      apiKey: config.FIREBASE_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.FIREBASE_PROJECT_ID,
      storageBucket: config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.FIREBASE_MSG_SENDER_ID,
      appId: config.FIREBASE_APP_ID,
      measurementId: config.FIREBASE_MEASUREMENT_ID,
    };

    const app: FirebaseApp = initializeApp(firebaseConfig);
    return getMessaging(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return null;
  }
};

export const isFirebaseSupported = async (): Promise<boolean> => {
  return await isSupported();
};
