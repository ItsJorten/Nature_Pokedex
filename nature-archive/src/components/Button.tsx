/**
 * Button Component
 *
 * A reusable button component with consistent styling.
 * Supports different variants (primary, secondary, outline)
 * and states (loading, disabled).
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { colors, spacing, borderRadius, typography } from '../theme';

/**
 * Button variants determine the visual style
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

/**
 * Button sizes
 */
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props
 */
interface ButtonProps {
  /** Button label text */
  title: string;
  /** Function called when button is pressed */
  onPress: () => void;
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Additional styles for the text */
  textStyle?: TextStyle;
  /** Icon component to show before the title */
  leftIcon?: React.ReactNode;
}

/**
 * Button Component
 *
 * @example
 * // Primary button (default)
 * <Button title="Continue" onPress={handlePress} />
 *
 * @example
 * // Outline button with loading state
 * <Button
 *   title="Sign In"
 *   variant="outline"
 *   loading={isSubmitting}
 *   onPress={handleSignIn}
 * />
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
}: ButtonProps) {
  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Get styles based on variant
  const variantStyles = getVariantStyles(variant, isDisabled);

  // Get styles based on size
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {/* Show loading spinner when loading */}
      {loading ? (
        <ActivityIndicator
          color={variantStyles.textColor}
          size="small"
        />
      ) : (
        <>
          {/* Optional left icon */}
          {leftIcon && <>{leftIcon}</>}

          {/* Button text */}
          <Text
            style={[
              styles.text,
              { color: variantStyles.textColor },
              sizeStyles.text,
              leftIcon ? styles.textWithIcon : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

/**
 * Get container and text styles based on variant
 */
function getVariantStyles(variant: ButtonVariant, isDisabled: boolean) {
  const baseOpacity = isDisabled ? 0.5 : 1;

  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: colors.primary.main,
          opacity: baseOpacity,
        } as ViewStyle,
        textColor: colors.text.inverse,
      };

    case 'secondary':
      return {
        container: {
          backgroundColor: colors.secondary.main,
          opacity: baseOpacity,
        } as ViewStyle,
        textColor: colors.text.inverse,
      };

    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary.main,
          opacity: baseOpacity,
        } as ViewStyle,
        textColor: colors.primary.main,
      };

    case 'text':
      return {
        container: {
          backgroundColor: 'transparent',
          opacity: baseOpacity,
        } as ViewStyle,
        textColor: colors.primary.main,
      };

    default:
      return {
        container: {} as ViewStyle,
        textColor: colors.text.primary,
      };
  }
}

/**
 * Get container and text styles based on size
 */
function getSizeStyles(size: ButtonSize) {
  switch (size) {
    case 'small':
      return {
        container: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        } as ViewStyle,
        text: {
          fontSize: typography.size.sm,
        } as TextStyle,
      };

    case 'large':
      return {
        container: {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
        } as ViewStyle,
        text: {
          fontSize: typography.size.lg,
        } as TextStyle,
      };

    case 'medium':
    default:
      return {
        container: {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        } as ViewStyle,
        text: {
          fontSize: typography.size.md,
        } as TextStyle,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    minHeight: 48, // Minimum touch target size for accessibility
  },

  text: {
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },

  textWithIcon: {
    marginLeft: spacing.sm,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default Button;
