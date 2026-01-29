/**
 * Main App Layout
 *
 * Layout for the main authenticated app experience.
 * Uses a tab navigator with three tabs:
 * - Home: Dashboard with recent discoveries and "New Scan" button
 * - Collection: User's saved discoveries (placeholder for now)
 * - Settings: App settings and account management (placeholder for now)
 *
 * The (main) folder name with parentheses means it's a "group"
 * in Expo Router - it affects URL structure but creates a shared layout.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, typography } from '../../src/theme';

/**
 * Icon component for tab bar
 */
function TabBarIcon({
  name,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return <Ionicons name={name} size={24} color={color} />;
}

/**
 * MainLayout Component
 *
 * Defines the tab navigation structure for authenticated users.
 */
export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        // Tab bar styling
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.light,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: typography.size.xs,
          fontWeight: typography.weight.medium,
          marginBottom: 4,
        },

        // Header styling
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitleStyle: {
          fontWeight: typography.weight.semibold,
          fontSize: typography.size.lg,
          color: colors.text.primary,
        },
        headerShadowVisible: false,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Nature Archive',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />

      {/* Collection Tab */}
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          headerTitle: 'My Collection',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="grid-outline" color={color} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
