/**
 * Firebase Configuration
 *
 * This file initializes Firebase services for the app.
 * Configuration values are read from environment variables
 * to keep sensitive data out of the codebase.
 *
 * IMPORTANT: Never hardcode Firebase credentials in this file.
 * Always use environment variables (EXPO_PUBLIC_* prefix for Expo).
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * Firebase configuration object
 * Values are loaded from environment variables set in .env file
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase app
 *
 * We check if an app already exists to prevent errors during hot reloading
 * in development. If an app exists, we reuse it; otherwise, we create a new one.
 */
let app: FirebaseApp;

if (getApps().length === 0) {
  // No Firebase app exists yet, create one
  app = initializeApp(firebaseConfig);
} else {
  // Reuse existing app (happens during hot reload)
  app = getApp();
}

/**
 * Firebase Auth instance
 * Used for user authentication (sign in, sign up, sign out)
 */
export const auth: Auth = getAuth(app);

/**
 * Firestore database instance
 * Used for storing user data, observations, and species information
 */
export const db: Firestore = getFirestore(app);

/**
 * Firebase Storage instance
 * Used for storing user photos of their nature discoveries
 */
export const storage: FirebaseStorage = getStorage(app);

/**
 * Export the Firebase app instance for cases where direct access is needed
 */
export { app };

/**
 * Helper function to check if Firebase is properly configured
 * Useful for debugging during development
 */
export function isFirebaseConfigured(): boolean {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'appId',
  ];

  return requiredKeys.every(
    (key) => firebaseConfig[key as keyof typeof firebaseConfig] !== undefined
  );
}
