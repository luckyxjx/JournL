-- CalmJournal Metadata Schema
-- This schema stores ONLY non-sensitive metadata for cross-device sync
-- Journal content, photos, and entry text are NEVER stored in cloud

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Metadata Table
-- Stores streak counts and entry statistics
CREATE TABLE user_metadata (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  total_entries INTEGER DEFAULT 0 CHECK (total_entries >= 0),
  last_entry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood Summaries Table
-- Stores aggregated mood counts (no entry content)
CREATE TABLE mood_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood VARCHAR(20) NOT NULL CHECK (mood IN ('joy', 'calm', 'reflective', 'sad')),
  count INTEGER DEFAULT 0 CHECK (count >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mood)
);

-- User Preferences Table
-- Stores theme and UI settings for cross-device sync
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'pastel' CHECK (theme IN ('light', 'dark', 'pastel')),
  font_size VARCHAR(20) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  animations_enabled BOOLEAN DEFAULT TRUE,
  local_encryption_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table
-- Stores achievement progress and unlock status
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL CHECK (achievement_type IN ('streak', 'entry_count', 'mood_variety')),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0),
  target INTEGER NOT NULL CHECK (target > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_type, name)
);

-- Indexes for performance
CREATE INDEX idx_mood_summaries_user_id ON mood_summaries(user_id);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_unlocked ON achievements(user_id, unlocked_at) WHERE unlocked_at IS NOT NULL;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_user_metadata_updated_at
  BEFORE UPDATE ON user_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_summaries_updated_at
  BEFORE UPDATE ON mood_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
-- Users can only access their own data

-- user_metadata policies
CREATE POLICY "Users can view own metadata"
  ON user_metadata FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metadata"
  ON user_metadata FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metadata"
  ON user_metadata FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own metadata"
  ON user_metadata FOR DELETE
  USING (auth.uid() = user_id);

-- mood_summaries policies
CREATE POLICY "Users can view own mood summaries"
  ON mood_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood summaries"
  ON mood_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood summaries"
  ON mood_summaries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood summaries"
  ON mood_summaries FOR DELETE
  USING (auth.uid() = user_id);

-- user_preferences policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- achievements policies
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON achievements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
  ON achievements FOR DELETE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE user_metadata IS 'Stores user streak counts and entry statistics (no journal content)';
COMMENT ON TABLE mood_summaries IS 'Stores aggregated mood counts for analytics (no entry content)';
COMMENT ON TABLE user_preferences IS 'Stores user UI preferences for cross-device sync';
COMMENT ON TABLE achievements IS 'Stores achievement progress and unlock status';

COMMENT ON COLUMN user_metadata.current_streak IS 'Current consecutive days with entries';
COMMENT ON COLUMN user_metadata.longest_streak IS 'Longest streak ever achieved';
COMMENT ON COLUMN user_metadata.total_entries IS 'Total number of entries created (count only, no content)';
COMMENT ON COLUMN user_metadata.last_entry_date IS 'Date of most recent entry (for streak calculation)';

COMMENT ON COLUMN mood_summaries.mood IS 'Mood type: joy, calm, reflective, or sad';
COMMENT ON COLUMN mood_summaries.count IS 'Number of entries with this mood (count only, no content)';

COMMENT ON COLUMN achievements.achievement_type IS 'Type of achievement: streak, entry_count, or mood_variety';
COMMENT ON COLUMN achievements.progress IS 'Current progress toward achievement target';
COMMENT ON COLUMN achievements.target IS 'Target value to unlock achievement';
COMMENT ON COLUMN achievements.unlocked_at IS 'Timestamp when achievement was unlocked (NULL if locked)';
