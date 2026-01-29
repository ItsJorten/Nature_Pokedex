/**
 * useAuth Hook
 *
 * A convenience hook that re-exports the auth context.
 * This provides a clean, simple import for components.
 *
 * Usage:
 * ```tsx
 * import { useAuth } from '@hooks/useAuth';
 *
 * function MyComponent() {
 *   const { user, signIn, signOut, isLoading } = useAuth();
 *   // ...
 * }
 * ```
 */

import { useAuthContext } from '../contexts/AuthContext';

/**
 * Hook to access authentication state and methods
 *
 * Returns:
 * - user: The current user's profile data (null if not logged in)
 * - firebaseUser: The Firebase Auth user object (uid, email)
 * - isLoading: True while checking authentication status
 * - isAuthenticated: True if a user is logged in
 * - signIn: Function to sign in with email/password
 * - signUp: Function to create a new account
 * - signOut: Function to sign out
 * - completeOnboarding: Function to mark onboarding as done
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
