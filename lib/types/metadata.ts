// TypeScript types for Supabase metadata tables
// These types match the database schema defined in supabase/migrations/001_create_metadata_schema.sql

export type MoodType = 'joy' | 'calm' | 'reflective' | 'sad';
export type ThemeType = 'light' | 'dark' | 'pastel';
export type FontSizeType = 'small' | 'medium' | 'large';
export type AchievementType = 'streak' | 'entry_count' | 'mood_variety';

/**
 * User metadata stored in cloud for cross-device sync
 * Contains ONLY statistics, never journal content
 */
export interface UserMetadata {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_entries: number;
  last_entry_date: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Aggregated mood counts for analytics
 * Contains ONLY counts, never entry content
 */
export interface MoodSummary {
  id: string;
  user_id: string;
  mood: MoodType;
  count: number;
  updated_at: string; // ISO timestamp
}

/**
 * User preferences for cross-device sync
 */
export interface UserPreferences {
  user_id: string;
  theme: ThemeType;
  font_size: FontSizeType;
  animations_enabled: boolean;
  local_encryption_enabled: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Achievement progress and unlock status
 */
export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  name: string;
  description: string | null;
  unlocked_at: string | null; // ISO timestamp, null if locked
  progress: number;
  target: number;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Insert types (without auto-generated fields)
 */
export type UserMetadataInsert = Omit<UserMetadata, 'created_at' | 'updated_at'>;
export type MoodSummaryInsert = Omit<MoodSummary, 'id' | 'updated_at'>;
export type UserPreferencesInsert = Omit<UserPreferences, 'created_at' | 'updated_at'>;
export type AchievementInsert = Omit<Achievement, 'id' | 'created_at' | 'updated_at'>;

/**
 * Update types (all fields optional except user_id)
 */
export type UserMetadataUpdate = Partial<Omit<UserMetadata, 'user_id' | 'created_at' | 'updated_at'>>;
export type MoodSummaryUpdate = Partial<Omit<MoodSummary, 'id' | 'user_id' | 'updated_at'>>;
export type UserPreferencesUpdate = Partial<Omit<UserPreferences, 'user_id' | 'created_at' | 'updated_at'>>;
export type AchievementUpdate = Partial<Omit<Achievement, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
