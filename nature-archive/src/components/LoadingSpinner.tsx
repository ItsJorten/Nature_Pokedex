/**
 * LoadingSpinner Component
 *
 * A full-screen loading indicator used during async operations.
 * Shows a spinner with optional message text.
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { colors, spacing, typography } from '../theme';

/**
 * LoadingSpinner component props
 */
interface LoadingSpinnerProps {
  /** Optional message to display below the spinner */
  message?: string;
  /** Size of the spinner */
  size?: 'small' | 'large';
  /** Color of the spinner (defaults to primary green) */
  color?: string;
  /** Whether to show as full-screen overlay */
  fullScreen?: boolean;
  /** Additional styles for the container */
  style?: ViewStyle;
}

/**
 * LoadingSpinner Component
 *
 * @example
 * // Full-screen loading (default)
 * <LoadingSpinner message="Loading your discoveries..." />
 *
 * @example
 * // Inline loading indicator
 * <LoadingSpinner size="small" fullScreen={false} />
 */
export function LoadingSpinner({
  message,
  size = 'large',
  color = colors.primary.main,
  fullScreen = true,
  style,
}: LoadingSpinnerProps) {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        style,
      ]}
    >
      {/* Spinner */}
      <ActivityIndicator size={size} color={color} />

      {/* Optional message */}
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  fullScreen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  message: {
    marginTop: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
