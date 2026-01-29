/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: FirebaseAuthUser | null) => {
        setIsLoading(true);

        if (authUser) {
          setFirebaseUser({
            uid: authUser.uid,
            email: authUser.email,
          });

          try {
            const userData = await getUserData(authUser.uid);
            setUser(userData);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          setFirebaseUser(null);
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await authSignIn(email, password);
    } catch (error: any) {
      const errorCode = error.code || 'unknown';
      throw new Error(getAuthErrorMessage(errorCode));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await authSignUp(email, password);
    } catch (error: any) {
      const errorCode = error.code || 'unknown';
      throw new Error(getAuthErrorMessage(errorCode));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authSignOut();
    } catch (error: any) {
      throw new Error('Failed to sign out. Please try again.');
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!firebaseUser) {
      throw new Error('No user logged in');
    }

    try {
      await authCompleteOnboarding(firebaseUser.uid);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, onboardingCompleted: true } : null
      );
    } catch (error) {
      throw new Error('Failed to complete onboarding. Please try again.');
    }
  }, [firebaseUser]);

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

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
