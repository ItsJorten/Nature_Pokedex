/**
 * Button Component
 *
 * Reusable button with variants and states.
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

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
}

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
  const isDisabled = disabled || loading;
  const variantStyles = getVariantStyles(variant, isDisabled);
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
      {loading ? (
        <ActivityIndicator color={variantStyles.textColor} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
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

function getVariantStyles(variant: ButtonVariant, isDisabled: boolean) {
  const baseOpacity = isDisabled ? 0.5 : 1;

  switch (variant) {
    case 'primary':
      return {
        container: { backgroundColor: colors.primary.main, opacity: baseOpacity } as ViewStyle,
        textColor: colors.text.inverse,
      };
    case 'secondary':
      return {
        container: { backgroundColor: colors.secondary.main, opacity: baseOpacity } as ViewStyle,
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
        container: { backgroundColor: 'transparent', opacity: baseOpacity } as ViewStyle,
        textColor: colors.primary.main,
      };
    default:
      return { container: {} as ViewStyle, textColor: colors.text.primary };
  }
}

function getSizeStyles(size: ButtonSize) {
  switch (size) {
    case 'small':
      return {
        container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md } as ViewStyle,
        text: { fontSize: typography.size.sm } as TextStyle,
      };
    case 'large':
      return {
        container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl } as ViewStyle,
        text: { fontSize: typography.size.lg } as TextStyle,
      };
    case 'medium':
    default:
      return {
        container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg } as ViewStyle,
        text: { fontSize: typography.size.md } as TextStyle,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    minHeight: 48,
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
