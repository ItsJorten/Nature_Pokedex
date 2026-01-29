/**
 * Theme Configuration
 *
 * This file defines all visual constants used throughout the app.
 * Using a centralized theme ensures consistent styling and makes
 * it easy to update colors, spacing, or fonts app-wide.
 */

// Color palette inspired by nature
export const colors = {
  // Primary colors - main brand colors
  primary: {
    main: '#2E7D32',      // Forest green - primary actions, headers
    light: '#4CAF50',     // Lighter green - hover states, accents
    dark: '#1B5E20',      // Dark green - pressed states
  },

  // Secondary colors - complementary accent colors
  secondary: {
    main: '#8D6E63',      // Earth brown - secondary elements
    light: '#A1887F',     // Light brown
    dark: '#6D4C41',      // Dark brown
  },

  // Background colors
  background: {
    primary: '#FFFFFF',   // Main background
    secondary: '#F5F5F5', // Cards, sections
    tertiary: '#E8F5E9',  // Light green tint for nature feel
  },

  // Text colors
  text: {
    primary: '#212121',   // Main text - high contrast
    secondary: '#757575', // Subdued text - descriptions, hints
    inverse: '#FFFFFF',   // Text on dark backgrounds
    disabled: '#BDBDBD',  // Disabled state text
  },

  // Category colors - used for species badges
  category: {
    plant: '#4CAF50',     // Green for plants
    animal: '#FF9800',    // Orange for animals
    insect: '#9C27B0',    // Purple for insects
  },

  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
  },
};

// Spacing scale (in pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius values
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Typography configuration
export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 40,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Shadow styles for elevation
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;
