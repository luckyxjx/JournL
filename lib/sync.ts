import { supabase } from './services/supabase/client';

export class MetadataSync {
  async syncStreak(userId: string, streak: number) {
    if (!userId) return;
    try {
      await supabase.from('user_metadata').upsert({
        user_id: userId,
        streak_count: streak,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Streak sync failed:', error);
    }
  }

  async syncMoodCount(userId: string, mood: string) {
    if (!userId) return;
    try {
      const { data } = await supabase.from('mood_summaries')
        .select('count').eq('user_id', userId).eq('mood', mood).single();
      
      await supabase.from('mood_summaries').upsert({
        user_id: userId,
        mood,
        count: (data?.count || 0) + 1,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Mood sync failed:', error);
    }
  }

  async syncPreferences(userId: string, preferences: Record<string, any>) {
    if (!userId) return;
    try {
      await supabase.from('user_preferences').upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Preferences sync failed:', error);
    }
  }
}