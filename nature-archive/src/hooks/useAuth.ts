/**
 * useAuth Hook
 *
 * Convenience hook that re-exports the auth context.
 */

import { useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}

export default useAuth;
