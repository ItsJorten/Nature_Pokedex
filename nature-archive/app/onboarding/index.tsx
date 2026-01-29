/**
 * Onboarding Screen
 *
 * A multi-step introduction shown to new users (first login only).
 * Explains the core app flow:
 * 1. Take a photo of nature (plant/animal/insect)
 * 2. The app analyzes your photo
 * 3. View and save the discovery to your collection
 *
 * After completing onboarding, the user is marked as onboarded
 * and redirected to the home screen.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/hooks/useAuth';
import { Button } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

// Get screen dimensions for slide sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Type definition for an onboarding slide
 */
interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

/**
 * Onboarding slides content
 * These explain the core app flow to new users
 */
const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'camera-outline',
    title: 'Discover Nature',
    description:
      'When you find a plant, animal, or insect in the wild, take a photo with your camera to identify it.',
  },
  {
    id: '2',
    icon: 'search-outline',
    title: 'Instant Recognition',
    description:
      'Our AI analyzes your photo and suggests what species it might be. You confirm the right match.',
  },
  {
    id: '3',
    icon: 'library-outline',
    title: 'Build Your Collection',
    description:
      'Each discovery is saved to your personal archive with detailed information. See what you\'ve found!',
  },
];

/**
 * OnboardingScreen Component
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  // Track which slide is currently visible
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ref to the FlatList for programmatic scrolling
  const flatListRef = useRef<FlatList>(null);

  // Loading state for completing onboarding
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle when viewable items change (slide changes)
   * Updates the current index for dot indicator
   */
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  /**
   * Configuration for viewability detection
   */
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  /**
   * Navigate to the next slide
   */
  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  /**
   * Complete onboarding and navigate to home
   */
  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Mark onboarding as completed in Firestore
      await completeOnboarding();

      // Navigate to home
      router.replace('/(main)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still try to navigate even if saving fails
      router.replace('/(main)');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Skip onboarding (same as completing it)
   */
  const handleSkip = async () => {
    await handleComplete();
  };

  /**
   * Render a single onboarding slide
   */
  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.icon}
          size={80}
          color={colors.primary.main}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  /**
   * Render dot indicators for slides
   */
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );

  // Determine if we're on the last slide
  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Skip button (top right) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom section: dots and button */}
      <View style={styles.footer}>
        {/* Dot indicators */}
        {renderDots()}

        {/* Next/Get Started button */}
        <Button
          title={isLastSlide ? 'Get Started' : 'Next'}
          onPress={isLastSlide ? handleComplete : goToNext}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },

  skipButton: {
    padding: spacing.sm,
  },

  skipText: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },

  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  description: {
    fontSize: typography.size.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
  },

  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.light,
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: colors.primary.main,
    width: 24,
  },

  button: {
    marginTop: spacing.sm,
  },
});
