/**
 * Home Screen (Dashboard)
 *
 * The main screen users see after logging in and completing onboarding.
 * Displays:
 * - User statistics (species discovered, total observations)
 * - "New Scan" button to start a new observation
 * - Recent discoveries list (empty state for now, will be populated later)
 *
 * This is the central hub for the app experience.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/hooks/useAuth';
import { Button } from '../../src/components';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';

/**
 * HomeScreen Component
 */
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Get stats from user profile (default to 0 if not available)
  const speciesCount = user?.stats?.speciesDiscoveredCount ?? 0;
  const observationsCount = user?.stats?.observationsCount ?? 0;

  /**
   * Handle "New Scan" button press
   * In Sprint 1, this shows an alert. Will be implemented in Sprint 2.
   */
  const handleNewScan = () => {
    // TODO: Navigate to camera screen in Sprint 2
    console.log('New Scan pressed - will be implemented in Sprint 2');
  };

  /**
   * Navigate to collection screen
   */
  const goToCollection = () => {
    router.push('/(main)/collection');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        {/* Species Discovered Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.category.plant + '20' }]}>
            <Ionicons
              name="leaf"
              size={24}
              color={colors.category.plant}
            />
          </View>
          <Text style={styles.statValue}>{speciesCount}</Text>
          <Text style={styles.statLabel}>Species Discovered</Text>
        </View>

        {/* Observations Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.primary.main + '20' }]}>
            <Ionicons
              name="camera"
              size={24}
              color={colors.primary.main}
            />
          </View>
          <Text style={styles.statValue}>{observationsCount}</Text>
          <Text style={styles.statLabel}>Observations</Text>
        </View>
      </View>

      {/* New Scan Button - Prominent CTA */}
      <View style={styles.scanButtonContainer}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleNewScan}
          activeOpacity={0.8}
        >
          <View style={styles.scanButtonInner}>
            <Ionicons
              name="camera"
              size={40}
              color={colors.text.inverse}
            />
            <Text style={styles.scanButtonText}>New Scan</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.scanHint}>
          Take a photo of a plant, animal, or insect
        </Text>
      </View>

      {/* Recent Discoveries Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Discoveries</Text>
          {observationsCount > 0 && (
            <TouchableOpacity onPress={goToCollection}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Empty state - shown when no discoveries yet */}
        {observationsCount === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name="images-outline"
                size={48}
                color={colors.text.disabled}
              />
            </View>
            <Text style={styles.emptyTitle}>No discoveries yet</Text>
            <Text style={styles.emptyDescription}>
              Start exploring! Take a photo of something in nature to add it to
              your collection.
            </Text>
            <Button
              title="Start Scanning"
              onPress={handleNewScan}
              variant="outline"
              style={styles.emptyButton}
            />
          </View>
        ) : (
          // Placeholder for recent discoveries list
          // Will be implemented when observation functionality is added
          <View style={styles.discoveryPlaceholder}>
            <Text style={styles.placeholderText}>
              Recent discoveries will appear here
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {/* View Collection */}
          <TouchableOpacity
            style={styles.quickAction}
            onPress={goToCollection}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary.main + '15' }]}>
              <Ionicons
                name="grid-outline"
                size={24}
                color={colors.primary.main}
              />
            </View>
            <Text style={styles.quickActionText}>View Collection</Text>
          </TouchableOpacity>

          {/* Browse by Category - Placeholder */}
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              // TODO: Implement category filter in collection
              goToCollection();
            }}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.category.animal + '15' }]}>
              <Ionicons
                name="filter-outline"
                size={24}
                color={colors.category.animal}
              />
            </View>
            <Text style={styles.quickActionText}>Browse Categories</Text>
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

  // Statistics Cards
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },

  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  statValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  statLabel: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  // Scan Button
  scanButtonContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  scanButton: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },

  scanButtonInner: {
    alignItems: 'center',
  },

  scanButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.inverse,
    marginTop: spacing.xs,
  },

  scanHint: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  seeAllText: {
    fontSize: typography.size.sm,
    color: colors.primary.main,
    fontWeight: typography.weight.medium,
  },

  // Empty State
  emptyState: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },

  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  emptyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  emptyDescription: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
    marginBottom: spacing.lg,
  },

  emptyButton: {
    minWidth: 160,
  },

  // Discovery Placeholder
  discoveryPlaceholder: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },

  placeholderText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  quickAction: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },

  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  quickActionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
