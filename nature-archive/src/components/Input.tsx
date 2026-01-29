/**
 * Input Component
 *
 * A reusable text input component with consistent styling.
 * Supports labels, error states, icons, and password visibility toggle.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme';

/**
 * Input component props
 * Extends TextInputProps to support all native TextInput properties
 */
interface InputProps extends TextInputProps {
  /** Label displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Helper text displayed below the input (when no error) */
  helperText?: string;
  /** Icon name to show on the left side */
  leftIcon?: keyof typeof Ionicons.glyphMap;
  /** Additional styles for the container */
  containerStyle?: ViewStyle;
}

/**
 * Input Component
 *
 * @example
 * // Basic email input
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * @example
 * // Password input with error
 * <Input
 *   label="Password"
 *   secureTextEntry
 *   value={password}
 *   onChangeText={setPassword}
 *   error={passwordError}
 *   leftIcon="lock-closed-outline"
 * />
 */
export function Input({
  label,
  error,
  helperText,
  leftIcon,
  containerStyle,
  secureTextEntry,
  style,
  ...textInputProps
}: InputProps) {
  // State for password visibility toggle
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show the password toggle
  const showPasswordToggle = secureTextEntry !== undefined;

  // Determine actual secureTextEntry value based on visibility state
  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

  // Determine border color based on error state
  const borderColor = error ? colors.status.error : colors.border.light;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input container with icons */}
      <View style={[styles.inputContainer, { borderColor }]}>
        {/* Left icon */}
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.text.secondary}
            style={styles.leftIcon}
          />
        )}

        {/* Text input */}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            showPasswordToggle && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={actualSecureTextEntry}
          {...textInputProps}
        />

        {/* Password visibility toggle */}
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Helper text (only shown when no error) */}
      {!error && helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
  },

  input: {
    flex: 1,
    height: 48, // Consistent height for touch targets
    paddingHorizontal: spacing.md,
    fontSize: typography.size.md,
    color: colors.text.primary,
  },

  inputWithLeftIcon: {
    paddingLeft: spacing.xs, // Reduce left padding when icon present
  },

  inputWithRightIcon: {
    paddingRight: spacing.xs, // Reduce right padding when toggle present
  },

  leftIcon: {
    marginLeft: spacing.md,
  },

  rightIcon: {
    padding: spacing.md,
  },

  error: {
    fontSize: typography.size.sm,
    color: colors.status.error,
    marginTop: spacing.xs,
  },

  helperText: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});

export default Input;
