/**
 * Authentication Service
 *
 * Contains all authentication-related functions.
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

const DEFAULT_USER_SETTINGS: UserSettings = {
  locationEnabled: false,
  language: 'nl',
};

const DEFAULT_USER_STATS: UserStats = {
  observationsCount: 0,
  speciesDiscoveredCount: 0,
};

export async function signUp(
  email: string,
  password: string
): Promise<FirebaseAuthUser> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const firebaseUser = userCredential.user;
  const userDocRef = doc(db, 'users', firebaseUser.uid);

  await setDoc(userDocRef, {
    email: firebaseUser.email,
    createdAt: serverTimestamp(),
    onboardingCompleted: false,
    settings: DEFAULT_USER_SETTINGS,
    stats: DEFAULT_USER_STATS,
  });

  return firebaseUser;
}

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

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserData(uid: string): Promise<User | null> {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();

  return {
    email: data.email,
    createdAt: data.createdAt?.toDate() || new Date(),
    onboardingCompleted: data.onboardingCompleted || false,
    settings: data.settings || DEFAULT_USER_SETTINGS,
    stats: data.stats || DEFAULT_USER_STATS,
  };
}

export async function completeOnboarding(uid: string): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    onboardingCompleted: true,
  });
}

export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    settings: settings,
  });
}

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
