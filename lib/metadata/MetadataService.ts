import { supabase } from '../supabase';
import type {
  UserMetadata,
  UserMetadataInsert,
  UserMetadataUpdate,
  MoodSummary,
  MoodSummaryInsert,
  MoodSummaryUpdate,
  UserPreferences,
  UserPreferencesInsert,
  UserPreferencesUpdate,
  Achievement,
  AchievementInsert,
  AchievementUpdate,
  MoodType,
} from '../types/metadata';

/**
 * Service for interacting with Supabase metadata tables
 * Handles ONLY non-sensitive metadata - never journal content
 */
export class MetadataService {
  // ==================== User Metadata ====================

  /**
   * Get user metadata (streaks, entry counts)
   */
  async getUserMetadata(userId: string): Promise<UserMetadata | null> {
    const { data, error } = await supabase
      .from('user_metadata')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user metadata doesn't exist yet
        return null;
      }
      throw new Error(`Failed to fetch user metadata: ${error.message}`);
    }

    return data;
  }

  /**
   * Create or update user metadata
   */
  async upsertUserMetadata(
    userId: string,
    metadata: UserMetadataUpdate
  ): Promise<UserMetadata> {
    const { data, error } = await supabase
      .from('user_metadata')
      .upsert(
        {
          user_id: userId,
          ...metadata,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user metadata: ${error.message}`);
    }

    return data;
  }

  /**
   * Increment streak count
   */
  async incrementStreak(userId: string): Promise<UserMetadata> {
    const current = await this.getUserMetadata(userId);
    const newStreak = (current?.current_streak || 0) + 1;
    const longestStreak = Math.max(
      newStreak,
      current?.longest_streak || 0
    );

    return this.upsertUserMetadata(userId, {
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_entry_date: new Date().toISOString(),
    });
  }

  /**
   * Reset streak to zero
   */
  async resetStreak(userId: string): Promise<UserMetadata> {
    return this.upsertUserMetadata(userId, {
      current_streak: 0,
      last_entry_date: new Date().toISOString(),
    });
  }

  /**
   * Increment total entry count
   */
  async incrementEntryCount(userId: string): Promise<UserMetadata> {
    const current = await this.getUserMetadata(userId);
    return this.upsertUserMetadata(userId, {
      total_entries: (current?.total_entries || 0) + 1,
    });
  }

  // ==================== Mood Summaries ====================

  /**
   * Get all mood summaries for a user
   */
  async getMoodSummaries(userId: string): Promise<MoodSummary[]> {
    const { data, error } = await supabase
      .from('mood_summaries')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch mood summaries: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get mood summary for a specific mood
   */
  async getMoodSummary(
    userId: string,
    mood: MoodType
  ): Promise<MoodSummary | null> {
    const { data, error } = await supabase
      .from('mood_summaries')
      .select('*')
      .eq('user_id', userId)
      .eq('mood', mood)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch mood summary: ${error.message}`);
    }

    return data;
  }

  /**
   * Increment mood count
   */
  async incrementMoodCount(
    userId: string,
    mood: MoodType
  ): Promise<MoodSummary> {
    const current = await this.getMoodSummary(userId, mood);
    const newCount = (current?.count || 0) + 1;

    const { data, error } = await supabase
      .from('mood_summaries')
      .upsert(
        {
          user_id: userId,
          mood,
          count: newCount,
        },
        {
          onConflict: 'user_id,mood',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to increment mood count: ${error.message}`);
    }

    return data;
  }

  /**
   * Decrement mood count (for entry deletion)
   */
  async decrementMoodCount(
    userId: string,
    mood: MoodType
  ): Promise<MoodSummary | null> {
    const current = await this.getMoodSummary(userId, mood);
    if (!current || current.count === 0) {
      return null;
    }

    const newCount = current.count - 1;

    const { data, error } = await supabase
      .from('mood_summaries')
      .update({ count: newCount })
      .eq('user_id', userId)
      .eq('mood', mood)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to decrement mood count: ${error.message}`);
    }

    return data;
  }

  // ==================== User Preferences ====================

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch user preferences: ${error.message}`);
    }

    return data;
  }

  /**
   * Create or update user preferences
   */
  async upsertUserPreferences(
    userId: string,
    preferences: UserPreferencesUpdate
  ): Promise<UserPreferences> {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: userId,
          ...preferences,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user preferences: ${error.message}`);
    }

    return data;
  }

  // ==================== Achievements ====================

  /**
   * Get all achievements for a user
   */
  async getAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get unlocked achievements for a user
   */
  async getUnlockedAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .not('unlocked_at', 'is', null)
      .order('unlocked_at', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to fetch unlocked achievements: ${error.message}`
      );
    }

    return data || [];
  }

  /**
   * Create a new achievement
   */
  async createAchievement(
    achievement: AchievementInsert
  ): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .insert(achievement)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create achievement: ${error.message}`);
    }

    return data;
  }

  /**
   * Update achievement progress
   */
  async updateAchievementProgress(
    achievementId: string,
    progress: number,
    unlock: boolean = false
  ): Promise<Achievement> {
    const update: AchievementUpdate = {
      progress,
    };

    if (unlock) {
      update.unlocked_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('achievements')
      .update(update)
      .eq('id', achievementId)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to update achievement progress: ${error.message}`
      );
    }

    return data;
  }

  /**
   * Unlock an achievement
   */
  async unlockAchievement(achievementId: string): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .update({ unlocked_at: new Date().toISOString() })
      .eq('id', achievementId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to unlock achievement: ${error.message}`);
    }

    return data;
  }

  // ==================== Batch Operations ====================

  /**
   * Sync all metadata after entry creation
   * This is called when a user creates a new entry
   */
  async syncAfterEntryCreation(
    userId: string,
    mood: MoodType,
    isNewDay: boolean
  ): Promise<void> {
    try {
      // Update entry count
      await this.incrementEntryCount(userId);

      // Update mood summary
      await this.incrementMoodCount(userId, mood);

      // Update streak if it's a new day
      if (isNewDay) {
        await this.incrementStreak(userId);
      }
    } catch (error) {
      // Log error but don't throw - local operations should continue
      console.error('Failed to sync metadata after entry creation:', error);
    }
  }

  /**
   * Sync all metadata after entry deletion
   */
  async syncAfterEntryDeletion(
    userId: string,
    mood: MoodType
  ): Promise<void> {
    try {
      // Decrement entry count
      const current = await this.getUserMetadata(userId);
      if (current && current.total_entries > 0) {
        await this.upsertUserMetadata(userId, {
          total_entries: current.total_entries - 1,
        });
      }

      // Decrement mood count
      await this.decrementMoodCount(userId, mood);
    } catch (error) {
      console.error('Failed to sync metadata after entry deletion:', error);
    }
  }
}

// Export singleton instance
export const metadataService = new MetadataService();
