/**
 * App Entry Point (Index Route)
 *
 * This is the first screen users see when opening the app.
 * It handles routing based on authentication state:
 *
 * 1. If loading → Show loading spinner
 * 2. If not authenticated → Redirect to login
 * 3. If authenticated but onboarding not complete → Redirect to onboarding
 * 4. If authenticated and onboarding complete → Redirect to home
 *
 * This pattern ensures users always end up on the right screen.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '../src/hooks/useAuth';
import { LoadingSpinner } from '../src/components';
import { colors } from '../src/theme';

/**
 * Index Screen Component
 *
 * Acts as a router guard that checks auth state and redirects accordingly.
 */
export default function Index() {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();

  /**
   * Effect that handles routing based on auth state
   *
   * Runs whenever auth state changes (loading complete, login, logout)
   */
  useEffect(() => {
    // Don't do anything while loading auth state
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      // User is not logged in → go to login screen
      router.replace('/(auth)/login');
    } else if (!user?.onboardingCompleted) {
      // User is logged in but hasn't completed onboarding
      router.replace('/onboarding');
    } else {
      // User is logged in and has completed onboarding → go to home
      router.replace('/(main)');
    }
  }, [isLoading, isAuthenticated, user, router]);

  /**
   * Show loading spinner while checking auth state
   *
   * This prevents a flash of the wrong screen while we determine
   * where the user should be directed.
   */
  return (
    <View style={styles.container}>
      <LoadingSpinner message="Loading..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
