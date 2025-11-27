'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { StreakService } from '@/lib/streak';
import { SettingsService } from '@/lib/settings';
import AuthGuard from '@/components/AuthGuard';
import { JournalEntry, MoodTag } from '@/lib/storage/db';
import { UserIcon, CalendarIcon, TrendingUpIcon, BookOpenIcon, PaletteIcon } from '@/components/icons/SettingsIcons';
import { JoyIcon, CalmIcon, ReflectiveIcon, SadIcon } from '@/components/icons/MoodIcons';

interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  joinDate: Date;
  mostCommonMood: MoodTag | null;
  entriesThisMonth: number;
  averageWordsPerEntry: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [user?.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Load all entries
      const entries = await entryRepository.list();
      
      // Load recent entries (5 most recent)
      const recent = await entryRepository.list({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
      setRecentEntries(recent);
      
      // Calculate stats
      const streakService = new StreakService();
      const currentStreak = await streakService.calculateCurrentStreak(user?.id || 'guest');
      const longestStreak = await streakService.calculateLongestStreak(user?.id || 'guest');
      
      // Calculate word counts
      const totalWords = entries.reduce((sum, entry) => {
        const wordCount = entry.content ? entry.content.split(/\s+/).filter(word => word.length > 0).length : 0;
        return sum + wordCount;
      }, 0);
      
      // Find most common mood
      const moodCounts: Record<MoodTag, number> = { joy: 0, calm: 0, reflective: 0, sad: 0 };
      entries.forEach(entry => {
        if (entry.mood) moodCounts[entry.mood]++;
      });
      const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
        moodCounts[a[0] as MoodTag] > moodCounts[b[0] as MoodTag] ? a : b
      )[0] as MoodTag;
      
      // Entries this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const entriesThisMonth = entries.filter(entry => 
        new Date(entry.createdAt) >= startOfMonth
      ).length;
      
      setStats({
        totalEntries: entries.length,
        currentStreak,
        longestStreak,
        totalWords,
        joinDate: user?.created_at ? new Date(user.created_at) : new Date(),
        mostCommonMood: entries.length > 0 ? mostCommonMood : null,
        entriesThisMonth,
        averageWordsPerEntry: entries.length > 0 ? Math.round(totalWords / entries.length) : 0
      });
      
      // Load settings
      const settingsService = new SettingsService();
      const userSettings = settingsService.getSettings();
      setSettings(userSettings);
      
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      console.log('Profile data loaded, setting loading to false');
      setLoading(false);
    }
  };

  const getMoodIcon = (mood: MoodTag) => {
    switch (mood) {
      case 'joy': return <JoyIcon className="w-5 h-5" />;
      case 'calm': return <CalmIcon className="w-5 h-5" />;
      case 'reflective': return <ReflectiveIcon className="w-5 h-5" />;
      case 'sad': return <SadIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
          <div className="text-peaceful-text text-xl">Loading profile...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-peaceful-bg p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()} 
              className="text-peaceful-text hover:text-peaceful-accent transition-colors p-2 rounded-lg hover:bg-white/20"
            >
              ← Back
            </motion.button>
            <h1 className="text-3xl font-serif font-bold text-peaceful-text">Profile</h1>
          </motion.div>

          {/* User Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-6 shadow-glass"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-peaceful-accent rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-peaceful-bg" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-peaceful-text">
                  {user?.email?.split('@')[0] || 'Guest User'}
                </h2>
                <p className="text-peaceful-secondary">{user?.email || 'guest@local'}</p>
                <p className="text-sm text-peaceful-secondary flex items-center gap-1 mt-1">
                  <CalendarIcon className="w-4 h-4" />
                  Joined {stats ? formatDate(stats.joinDate) : 'Recently'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Reorganized for better hierarchy */}
          <div className="space-y-4">
            {/* Row 1: Consistency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 shadow-glass"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="w-5 h-5 text-peaceful-accent" />
                  <span className="text-sm text-peaceful-secondary">Current Streak</span>
                </div>
                <p className="text-2xl font-bold text-peaceful-text">{stats?.currentStreak || 0} {(stats?.currentStreak || 0) === 1 ? 'day' : 'days'}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 shadow-glass"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUpIcon className="w-5 h-5 text-peaceful-accent" />
                  <span className="text-sm text-peaceful-secondary">Longest Streak</span>
                </div>
                <p className="text-2xl font-bold text-peaceful-text">{stats?.longestStreak || 0} {(stats?.longestStreak || 0) === 1 ? 'day' : 'days'}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 shadow-glass"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BookOpenIcon className="w-5 h-5 text-peaceful-accent" />
                  <span className="text-sm text-peaceful-secondary">Total Entries</span>
                </div>
                <p className="text-2xl font-bold text-peaceful-text">{stats?.totalEntries || 0}</p>
              </motion.div>
            </div>

            {/* Row 2: Content Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 shadow-glass"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-peaceful-secondary text-sm">Total Words</span>
                </div>
                <p className="text-2xl font-bold text-peaceful-text">{stats?.totalWords?.toLocaleString() || 0}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 shadow-glass"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-peaceful-secondary text-sm">Avg Words/Entry</span>
                </div>
                <p className="text-2xl font-bold text-peaceful-text">{stats?.averageWordsPerEntry || 0}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 shadow-glass"
              >
                <div className="flex items-center gap-3 mb-2">
                  {stats?.mostCommonMood && getMoodIcon(stats.mostCommonMood)}
                  <span className="text-sm text-peaceful-secondary">Common Mood</span>
                </div>
                <p className="text-lg font-semibold text-peaceful-text capitalize">
                  {stats?.mostCommonMood || 'None yet'}
                </p>
              </motion.div>
            </div>
          </div>



          {/* Current Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-6 shadow-glass"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif font-semibold text-peaceful-text">Current Preferences</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/settings')}
                className="text-peaceful-accent hover:text-peaceful-text transition-colors"
              >
                Edit Settings →
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl">
                <PaletteIcon className="w-5 h-5 text-peaceful-accent" />
                <div>
                  <p className="text-sm text-peaceful-secondary">Theme</p>
                  <p className="font-medium text-peaceful-text capitalize">{settings?.theme || 'pastel'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl">
                <span className="text-peaceful-accent text-lg">Aa</span>
                <div>
                  <p className="text-sm text-peaceful-secondary">Font Size</p>
                  <p className="font-medium text-peaceful-text capitalize">{settings?.fontSize || 'medium'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-xl">
                <span className="text-peaceful-accent text-lg">✨</span>
                <div>
                  <p className="text-sm text-peaceful-secondary">Animations</p>
                  <p className="font-medium text-peaceful-text">{settings?.animations ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          {recentEntries.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-6 shadow-glass"
            >
              <h3 className="text-xl font-serif font-semibold text-peaceful-text mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentEntries.slice(0, 3).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/20 rounded-xl"
                  >
                    {entry.mood && getMoodIcon(entry.mood)}
                    <div className="flex-1">
                      <p className="text-sm text-peaceful-secondary">
                        {formatDate(new Date(entry.createdAt))}
                      </p>
                      <p className="text-peaceful-text line-clamp-1">
                        {entry.content?.replace(/<[^>]*>/g, '').slice(0, 60)}...
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}