/**
 * Authentication Context
 *
 * This context provides authentication state and methods throughout the app.
 * It wraps the entire application and manages:
 * - Current user state
 * - Loading state during auth operations
 * - Sign in/up/out methods
 * - Onboarding completion
 *
 * Components can access auth state via the useAuth hook.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';

import { auth } from '../config/firebase';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  getUserData,
  completeOnboarding as authCompleteOnboarding,
  getAuthErrorMessage,
} from '../services/authService';
import { User, AuthContextValue, FirebaseUser } from '../types';

/**
 * Create the context with undefined as initial value
 * This will be overwritten by the provider
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 *
 * Wraps the app and provides authentication state to all child components.
 * Listens to Firebase auth state changes and syncs with Firestore user data.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // State for the Firestore user document (contains settings, stats, etc.)
  const [user, setUser] = useState<User | null>(null);

  // State for the Firebase Auth user (contains uid, email)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Loading state - true while checking auth status
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Subscribe to Firebase auth state changes
   *
   * This effect runs once on mount and sets up a listener.
   * When auth state changes (login/logout), it:
   * 1. Updates firebaseUser state
   * 2. Fetches the full user document from Firestore
   * 3. Updates user state
   */
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: FirebaseAuthUser | null) => {
        setIsLoading(true);

        if (authUser) {
          // User is signed in
          setFirebaseUser({
            uid: authUser.uid,
            email: authUser.email,
          });

          // Fetch additional user data from Firestore
          try {
            const userData = await getUserData(authUser.uid);
            setUser(userData);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          // User is signed out
          setFirebaseUser(null);
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   *
   * Wraps the authService signIn and handles errors.
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await authSignIn(email, password);
      // Auth state listener will update the state automatically
    } catch (error: any) {
      // Convert Firebase error to user-friendly message
      const errorCode = error.code || 'unknown';
      throw new Error(getAuthErrorMessage(errorCode));
    }
  }, []);

  /**
   * Create a new account with email and password
   *
   * Wraps the authService signUp and handles errors.
   */
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await authSignUp(email, password);
      // Auth state listener will update the state automatically
    } catch (error: any) {
      const errorCode = error.code || 'unknown';
      throw new Error(getAuthErrorMessage(errorCode));
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      await authSignOut();
      // Auth state listener will update the state automatically
    } catch (error: any) {
      throw new Error('Failed to sign out. Please try again.');
    }
  }, []);

  /**
   * Mark onboarding as completed for the current user
   *
   * Updates Firestore and local state so the user
   * won't see the onboarding screens again.
   */
  const completeOnboarding = useCallback(async () => {
    if (!firebaseUser) {
      throw new Error('No user logged in');
    }

    try {
      await authCompleteOnboarding(firebaseUser.uid);

      // Update local state immediately for responsive UI
      setUser((prevUser) =>
        prevUser ? { ...prevUser, onboardingCompleted: true } : null
      );
    } catch (error) {
      throw new Error('Failed to complete onboarding. Please try again.');
    }
  }, [firebaseUser]);

  /**
   * Context value containing state and methods
   */
  const value: AuthContextValue = {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated: !!firebaseUser,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context
 *
 * Throws an error if used outside of AuthProvider.
 * This ensures proper usage and provides TypeScript type safety.
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
