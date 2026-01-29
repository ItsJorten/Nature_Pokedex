/**
 * Settings Screen
 *
 * Allows users to manage their account and app preferences.
 * Includes:
 * - App version display
 * - Privacy settings (location toggle)
 * - Sign out functionality
 * - Account deletion request (placeholder)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { useAuth } from '../../src/hooks/useAuth';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';

/**
 * SettingsScreen Component
 */
export default function SettingsScreen() {
  const { user, firebaseUser, signOut } = useAuth();

  // Local state for location toggle
  // In a full implementation, this would sync with Firestore
  const [locationEnabled, setLocationEnabled] = useState(
    user?.settings?.locationEnabled ?? false
  );

  // Loading state for sign out
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Get app version from Expo Constants
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  /**
   * Handle location toggle change
   */
  const handleLocationToggle = (value: boolean) => {
    setLocationEnabled(value);
    // TODO: In a full implementation, save to Firestore:
    // updateUserSettings(firebaseUser.uid, { locationEnabled: value });
  };

  /**
   * Handle sign out with confirmation
   */
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsSigningOut(true);
            try {
              await signOut();
              // Navigation happens automatically via auth state change
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Handle account deletion request
   * In MVP, this shows an info dialog rather than immediately deleting
   */
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Account deletion requires confirmation for your security. This feature will be available in a future update.\n\nFor now, please contact support if you wish to delete your account.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {/* Email display */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="mail-outline"
                size={22}
                color={colors.text.secondary}
              />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>Email</Text>
                <Text style={styles.rowValue}>
                  {firebaseUser?.email ?? 'Not available'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.card}>
          {/* Location toggle */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="location-outline"
                size={22}
                color={colors.text.secondary}
              />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>Save Location</Text>
                <Text style={styles.rowDescription}>
                  Add location (city/region) to your discoveries
                </Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={handleLocationToggle}
              trackColor={{
                false: colors.border.medium,
                true: colors.primary.light,
              }}
              thumbColor={
                locationEnabled ? colors.primary.main : colors.background.primary
              }
            />
          </View>
        </View>
        <Text style={styles.privacyNote}>
          Your discoveries are always private and only visible to you.
        </Text>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          {/* Version */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.text.secondary}
              />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>Version</Text>
                <Text style={styles.rowValue}>{appVersion}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <View style={styles.card}>
          {/* Sign Out */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="log-out-outline"
                size={22}
                color={colors.status.warning}
              />
              <Text style={[styles.actionText, { color: colors.status.warning }]}>
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.disabled}
            />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Delete Account */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAccount}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="trash-outline"
                size={22}
                color={colors.status.error}
              />
              <Text style={[styles.actionText, { color: colors.status.error }]}>
                Delete Account
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.disabled}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },

  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },

  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  rowTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },

  rowLabel: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
  },

  rowValue: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },

  rowDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },

  privacyNote: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },

  actionText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    marginLeft: spacing.md,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
});
