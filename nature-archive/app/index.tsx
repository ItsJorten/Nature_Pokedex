/**
 * App Entry Point
 *
 * Handles routing based on authentication state.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '../src/hooks/useAuth';
import { LoadingSpinner } from '../src/components';
import { colors } from '../src/theme';

export default function Index() {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (!user?.onboardingCompleted) {
      router.replace('/onboarding');
    } else {
      router.replace('/(main)');
    }
  }, [isLoading, isAuthenticated, user, router]);

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
