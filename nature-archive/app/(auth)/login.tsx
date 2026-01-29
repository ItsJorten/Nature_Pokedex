/**
 * Login Screen
 *
 * Allows existing users to sign in with email and password.
 * Provides a link to the registration screen for new users.
 *
 * Features:
 * - Email/password input with validation
 * - Error handling with user-friendly messages
 * - Loading state during sign-in
 * - Link to register screen
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
 * LoginScreen Component
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      setError('Please enter your password.');
      return false;
    }

    return true;
  };

  /**
   * Handle sign in button press
   */
  const handleSignIn = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn(email.trim(), password);
      // Navigation happens automatically via the index.tsx auth check
    } catch (err: any) {
      // Show error message from auth service
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to registration screen
   */
  const goToRegister = () => {
    router.push('/(auth)/register');
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
          {/* Header section with icon and welcome text */}
          <View style={styles.header}>
            {/* App icon/logo placeholder */}
            <View style={styles.iconContainer}>
              <Ionicons
                name="leaf"
                size={64}
                color={colors.primary.main}
              />
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue exploring nature
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
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock-closed-outline"
            />

            {/* Sign in button */}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={isLoading}
              style={styles.signInButton}
            />
          </View>

          {/* Footer with register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.linkText}>Create Account</Text>
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
    justifyContent: 'center',
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

  signInButton: {
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
