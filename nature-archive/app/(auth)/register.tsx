/**
 * Register Screen
 *
 * Allows new users to create an account with email and password.
 * Includes password confirmation for security.
 *
 * Features:
 * - Email/password input with validation
 * - Password confirmation check
 * - Error handling with user-friendly messages
 * - Loading state during registration
 * - Link back to login screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/hooks/useAuth';
import { Button, Input } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

/**
 * RegisterScreen Component
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate form inputs before submission
   * Returns true if valid, false otherwise
   */
  const validateForm = (): boolean => {
    // Reset error
    setError(null);

    // Check email
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Check password
    if (!password) {
      setError('Please enter a password.');
      return false;
    }

    // Check password length (Firebase requires min 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  /**
   * Handle registration button press
   */
  const handleRegister = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signUp(email.trim(), password);
      // Navigation happens automatically via the index.tsx auth check
      // New users will be redirected to onboarding
    } catch (err: any) {
      // Show error message from auth service
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate back to login screen
   */
  const goToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={goToLogin}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>

          {/* Header section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="leaf"
                size={64}
                color={colors.primary.main}
              />
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Nature Archive and start your collection
            </Text>
          </View>

          {/* Form section */}
          <View style={styles.form}>
            {/* Error message */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={colors.status.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email input */}
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              leftIcon="mail-outline"
            />

            {/* Password input */}
            <Input
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              autoComplete="password-new"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
              helperText="Must be at least 6 characters"
            />

            {/* Confirm password input */}
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              autoComplete="password-new"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon="lock-closed-outline"
            />

            {/* Register button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />
          </View>

          {/* Footer with login link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  form: {
    marginBottom: spacing.xl,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },

  errorText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.status.error,
    fontSize: typography.size.sm,
  },

  registerButton: {
    marginTop: spacing.md,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },

  linkText: {
    fontSize: typography.size.md,
    color: colors.primary.main,
    fontWeight: typography.weight.semibold,
  },
});
