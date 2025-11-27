# Supabase Database Setup

This directory contains SQL migrations for the CalmJournal metadata schema.

## Important Privacy Note

⚠️ **The Supabase database stores ONLY non-sensitive metadata:**
- Streak counts and statistics
- Mood summaries (counts only, no entry content)
- User preferences (theme, font size, etc.)
- Achievement progress

**Journal entries, photos, and all personal content are stored ONLY in the browser's IndexedDB and NEVER transmitted to the cloud.**

## Schema Overview

The database includes four tables:

1. **user_metadata** - Streak counts and entry statistics
2. **mood_summaries** - Aggregated mood counts for analytics
3. **user_preferences** - UI preferences for cross-device sync
4. **achievements** - Achievement progress and unlock status

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the contents of `migrations/001_create_metadata_schema.sql`
5. Paste into the SQL Editor
6. Click "Run" to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

### Option 3: Manual Execution

You can also execute the SQL file directly using any PostgreSQL client connected to your Supabase database.

## Verification

After running the migration, verify the setup:

1. Check that all four tables exist:
   - `user_metadata`
   - `mood_summaries`
   - `user_preferences`
   - `achievements`

2. Verify Row Level Security is enabled on all tables:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('user_metadata', 'mood_summaries', 'user_preferences', 'achievements');
   ```
   All should show `rowsecurity = true`

3. Check that policies are created:
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```
   You should see policies for SELECT, INSERT, UPDATE, and DELETE on each table.

## Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API".

## Testing the Schema

You can test the schema by running queries in the Supabase SQL Editor:

```sql
-- Test inserting user metadata (replace with actual user_id from auth.users)
INSERT INTO user_metadata (user_id, current_streak, total_entries)
VALUES ('your-user-id', 5, 10);

-- Test inserting mood summary
INSERT INTO mood_summaries (user_id, mood, count)
VALUES ('your-user-id', 'calm', 3);

-- Test inserting preferences
INSERT INTO user_preferences (user_id, theme, font_size)
VALUES ('your-user-id', 'pastel', 'medium');

-- Test inserting achievement
INSERT INTO achievements (user_id, achievement_type, name, description, progress, target)
VALUES ('your-user-id', 'streak', 'Week Warrior', 'Write for 7 consecutive days', 5, 7);
```

## Schema Updates

If you need to modify the schema in the future:

1. Create a new migration file: `002_description.sql`
2. Add your ALTER TABLE or other DDL statements
3. Run the new migration using one of the methods above
4. Update the TypeScript types in `lib/types/metadata.ts` if needed

## Rollback

If you need to rollback the schema:

```sql
-- Drop all tables (this will delete all data!)
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS mood_summaries CASCADE;
DROP TABLE IF EXISTS user_metadata CASCADE;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

⚠️ **Warning:** This will permanently delete all metadata. Use with caution!

## Support

For issues with Supabase setup:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)
