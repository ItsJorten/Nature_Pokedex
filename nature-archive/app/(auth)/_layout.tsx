/**
 * Auth Layout
 *
 * Layout for authentication screens (login, register).
 * These screens are shown to unauthenticated users.
 *
 * The (auth) folder name with parentheses means it's a "group"
 * in Expo Router - it affects URL structure but not the visual layout.
 */

import React from 'react';
import { Stack } from 'expo-router';

import { colors } from '../../src/theme';

/**
 * AuthLayout Component
 *
 * Defines navigation behavior for auth screens.
 * Both login and register are simple stack screens.
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        // Enable swipe back gesture
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
