/**
 * Type Definitions
 *
 * This file contains TypeScript interfaces and types used throughout the app.
 * Centralizing types ensures consistency and makes refactoring easier.
 */

// ============================================
// User Types
// ============================================

/**
 * User settings that can be configured in the app
 */
export interface UserSettings {
  locationEnabled: boolean;  // Whether to save location with observations
  language: 'nl' | 'en';     // App language preference
}

/**
 * Statistics tracked for each user
 */
export interface UserStats {
  observationsCount: number;     // Total number of observations made
  speciesDiscoveredCount: number; // Unique species the user has found
}

/**
 * Complete user profile stored in Firestore users/{uid}
 */
export interface User {
  email: string;
  createdAt: Date;
  onboardingCompleted: boolean;
  settings: UserSettings;
  stats: UserStats;
}

// ============================================
// Observation Types
// ============================================

/**
 * Possible states an observation can be in during its lifecycle
 */
export type ObservationStatus =
  | 'uploaded'         // Photo uploaded, waiting for analysis
  | 'analyzing'        // AI is processing the image
  | 'ready_for_review' // Suggestions ready, waiting for user confirmation
  | 'confirmed'        // User confirmed a suggestion
  | 'saved'            // Saved to user's collection
  | 'deleted'          // Marked for deletion
  | 'failed';          // Analysis failed

/**
 * Image data for an observation
 */
export interface ObservationImage {
  storagePath: string;  // Firebase Storage path
  downloadUrl: string;  // Public URL to access the image
}

/**
 * A single suggestion from the AI recognition service
 */
export interface RecognitionSuggestion {
  speciesId: string;
  name: string;
  latinName: string;
  confidence: number;      // 0-1, how confident the AI is
  referenceImageUrl: string;
  category: SpeciesCategory;
}

/**
 * The confirmed species selection by the user
 */
export interface ConfirmedSpecies {
  speciesId: string;
  confidence: number;
  isNewForUser: boolean;  // First time user discovered this species
}

/**
 * Optional location data (coarse, not exact GPS)
 */
export interface ObservationLocation {
  enabled: boolean;
  label?: string;  // City/region name, e.g., "Apeldoorn"
}

/**
 * Complete observation document stored in Firestore observations/{observationId}
 */
export interface Observation {
  id: string;
  uid: string;                    // User who made this observation
  status: ObservationStatus;
  createdAt: Date;
  image: ObservationImage;
  suggestions: RecognitionSuggestion[];
  confirmed?: ConfirmedSpecies;
  location: ObservationLocation;
}

// ============================================
// Species Types
// ============================================

/**
 * Categories of species the app can recognize
 */
export type SpeciesCategory = 'plant' | 'insect' | 'animal';

/**
 * Multilingual text support
 */
export interface MultilingualText {
  nl: string;
  en: string;
}

/**
 * Detailed information about a species
 */
export interface SpeciesInfo {
  description: MultilingualText;
  identificationPoints: { nl: string[]; en: string[] };
  habitat: MultilingualText;
  seasonality: MultilingualText;
}

/**
 * Complete species document stored in Firestore species/{speciesId}
 */
export interface Species {
  id: string;
  name: MultilingualText;
  latinName: string;
  category: SpeciesCategory;
  info: SpeciesInfo;
  referenceImageUrl?: string;
}

// ============================================
// Auth Types
// ============================================

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Minimal Firebase user info we need
 */
export interface FirebaseUser {
  uid: string;
  email: string | null;
}

/**
 * Auth context value type
 */
export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

// ============================================
// Navigation Types
// ============================================

/**
 * Route parameters for type-safe navigation (extend as needed)
 */
export interface RouteParams {
  observationId?: string;
  speciesId?: string;
}
