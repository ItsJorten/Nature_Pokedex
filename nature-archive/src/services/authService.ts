/**
 * Authentication Service
 *
 * This file contains all authentication-related functions.
 * It wraps Firebase Auth methods and handles Firestore user document management.
 *
 * Key responsibilities:
 * - Sign in/up/out users
 * - Create user documents in Firestore
 * - Fetch and update user data
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseAuthUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { User, UserSettings, UserStats } from '../types';

/**
 * Default settings for new users
 * - locationEnabled: false for privacy-by-default
 * - language: 'nl' as default (Dutch)
 */
const DEFAULT_USER_SETTINGS: UserSettings = {
  locationEnabled: false,
  language: 'nl',
};

/**
 * Default statistics for new users
 */
const DEFAULT_USER_STATS: UserStats = {
  observationsCount: 0,
  speciesDiscoveredCount: 0,
};

/**
 * Creates a new user account with email and password
 *
 * This function:
 * 1. Creates Firebase Auth account
 * 2. Creates a user document in Firestore with default values
 *
 * @param email - User's email address
 * @param password - User's chosen password
 * @returns The Firebase Auth user object
 * @throws Error if registration fails
 */
export async function signUp(
  email: string,
  password: string
): Promise<FirebaseAuthUser> {
  // Create Firebase Auth account
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const firebaseUser = userCredential.user;

  // Create user document in Firestore
  // This stores additional user data not in Firebase Auth
  const userDocRef = doc(db, 'users', firebaseUser.uid);

  await setDoc(userDocRef, {
    email: firebaseUser.email,
    createdAt: serverTimestamp(),
    onboardingCompleted: false, // New users must complete onboarding
    settings: DEFAULT_USER_SETTINGS,
    stats: DEFAULT_USER_STATS,
  });

  return firebaseUser;
}

/**
 * Signs in an existing user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns The Firebase Auth user object
 * @throws Error if login fails (wrong credentials, etc.)
 */
export async function signIn(
  email: string,
  password: string
): Promise<FirebaseAuthUser> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

/**
 * Signs out the current user
 *
 * @throws Error if sign out fails
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Fetches a user's profile data from Firestore
 *
 * @param uid - The user's Firebase Auth UID
 * @returns User object or null if not found
 */
export async function getUserData(uid: string): Promise<User | null> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();

  // Convert Firestore timestamp to JS Date
  return {
    email: data.email,
    createdAt: data.createdAt?.toDate() || new Date(),
    onboardingCompleted: data.onboardingCompleted || false,
    settings: data.settings || DEFAULT_USER_SETTINGS,
    stats: data.stats || DEFAULT_USER_STATS,
  };
}

/**
 * Marks the user's onboarding as completed
 *
 * Called after the user finishes the onboarding flow.
 * Sets onboardingCompleted to true so they don't see it again.
 *
 * @param uid - The user's Firebase Auth UID
 */
export async function completeOnboarding(uid: string): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    onboardingCompleted: true,
  });
}

/**
 * Updates user settings
 *
 * @param uid - The user's Firebase Auth UID
 * @param settings - Partial settings object with fields to update
 */
export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    settings: settings,
  });
}

/**
 * Error message mapping for user-friendly error messages
 *
 * Firebase error codes are technical; this maps them to user-friendly messages.
 * Used by the UI to display helpful error feedback.
 */
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred.';
}
