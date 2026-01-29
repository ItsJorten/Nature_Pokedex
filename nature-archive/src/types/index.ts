/**
 * Type Definitions
 *
 * This file contains TypeScript interfaces and types used throughout the app.
 */

// ============================================
// User Types
// ============================================

export interface UserSettings {
  locationEnabled: boolean;
  language: 'nl' | 'en';
}

export interface UserStats {
  observationsCount: number;
  speciesDiscoveredCount: number;
}

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

export type ObservationStatus =
  | 'uploaded'
  | 'analyzing'
  | 'ready_for_review'
  | 'confirmed'
  | 'saved'
  | 'deleted'
  | 'failed';

export interface ObservationImage {
  storagePath: string;
  downloadUrl: string;
}

export interface RecognitionSuggestion {
  speciesId: string;
  name: string;
  latinName: string;
  confidence: number;
  referenceImageUrl: string;
  category: SpeciesCategory;
}

export interface ConfirmedSpecies {
  speciesId: string;
  confidence: number;
  isNewForUser: boolean;
}

export interface ObservationLocation {
  enabled: boolean;
  label?: string;
}

export interface Observation {
  id: string;
  uid: string;
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

export type SpeciesCategory = 'plant' | 'insect' | 'animal';

export interface MultilingualText {
  nl: string;
  en: string;
}

export interface SpeciesInfo {
  description: MultilingualText;
  identificationPoints: { nl: string[]; en: string[] };
  habitat: MultilingualText;
  seasonality: MultilingualText;
}

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

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export interface RouteParams {
  observationId?: string;
  speciesId?: string;
}
