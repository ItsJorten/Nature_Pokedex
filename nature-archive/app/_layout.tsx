/**
 * Root Layout
 *
 * This is the top-level layout that wraps the entire application.
 * It sets up:
 * - AuthProvider for authentication state management
 * - Safe area handling
 * - Status bar configuration
 * - Navigation stack
 *
 * Expo Router uses file-based routing. This _layout.tsx file
 * defines the layout for all routes in the app directory.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '../src/contexts/AuthContext';
import { colors } from '../src/theme';

/**
 * RootLayout Component
 *
 * The root component that wraps the entire app with necessary providers.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Wrap app with AuthProvider to make auth available everywhere */}
      <AuthProvider>
        {/* Configure status bar */}
        <StatusBar style="dark" />

        {/* Main navigation stack */}
        <Stack
          screenOptions={{
            // Hide header by default (screens can override)
            headerShown: false,
            // Set background color to prevent flash
            contentStyle: {
              backgroundColor: colors.background.primary,
            },
          }}
        >
          {/* Define screen options for specific routes */}
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen
            name="onboarding/index"
            options={{
              // Prevent going back from onboarding
              gestureEnabled: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
