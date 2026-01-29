/**
 * Collection Screen (Placeholder)
 *
 * This screen will display the user's saved discoveries in a grid view.
 * For Sprint 1, this is a placeholder with the basic structure.
 *
 * Full implementation will include:
 * - Grid view with thumbnails
 * - Category filter
 * - Search functionality
 * - Sort options (newest/oldest first)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

/**
 * CollectionScreen Component (Placeholder)
 */
export default function CollectionScreen() {
  const { user } = useAuth();

  // Get observation count from user profile
  const observationsCount = user?.stats?.observationsCount ?? 0;

  return (
    <View style={styles.container}>
      {/* Empty state - shown when no discoveries */}
      <View style={styles.emptyState}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="grid-outline"
            size={64}
            color={colors.text.disabled}
          />
        </View>

        <Text style={styles.title}>Your Collection</Text>

        {observationsCount === 0 ? (
          <>
            <Text style={styles.description}>
              Your discovered species will appear here. Start by taking a photo
              of something in nature!
            </Text>
            <View style={styles.hintContainer}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.primary.main}
              />
              <Text style={styles.hintText}>
                Go to Home and tap "New Scan" to begin
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.description}>
            Collection grid will be implemented in a future sprint.
            You have {observationsCount} observation(s).
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  description: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
    marginBottom: spacing.lg,
  },

  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },

  hintText: {
    fontSize: typography.size.sm,
    color: colors.primary.main,
    marginLeft: spacing.sm,
    fontWeight: typography.weight.medium,
  },
});
