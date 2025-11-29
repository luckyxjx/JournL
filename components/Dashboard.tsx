'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MoodSelector from './MoodSelector';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { JournalEntry, MoodTag } from '@/lib/storage/db';
import { StreakIcon, WriteIcon, JournalIcon, OfflineIcon, JoyIcon, CalmIcon, ReflectiveIcon, SadIcon } from './icons/MoodIcons';
import FloatingActionButton from './FloatingActionButton';
import { useAuth } from '@/lib/auth';
import { StreakService } from '@/lib/streak';
import { AchievementSystem } from '@/lib/achievements';
import { SettingsIcon, AnalyticsIcon, UserIcon } from '@/components/icons/SettingsIcons';

interface EntryPreview {
  id: string;
  excerpt: string;
  mood: MoodTag;
  createdAt: Date;
}

export default function Dashboard() {
  const { user, isGuest } = useAuth();
  const [todayMood, setTodayMood] = useState<MoodTag | undefined>();
  const [recentEntries, setRecentEntries] = useState<EntryPreview[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const calculateStreak = async (): Promise<number> => {
    if (!user?.id) {
      console.warn('No user ID available for streak calculation');
      return 0;
    }
    try {
      const streakService = new StreakService();
      return await streakService.calculateCurrentStreak(user.id);
    } catch (error) {
      console.error('Failed to calculate streak:', error);
      return 0;
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load recent entries (3 most recent)
        const entries = await entryRepository.list({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' });
        
        const previews: EntryPreview[] = entries.map(entry => ({
          id: entry.id,
          excerpt: stripHtml(entry.content || '').slice(0, 100),
          mood: entry.mood,
          createdAt: entry.createdAt,
        }));
        
        setRecentEntries(previews);
        
        // Calculate streak and check achievements
        const streak = await calculateStreak();
        setCurrentStreak(streak);
        
        // Check for new achievements
        const achievementSystem = new AchievementSystem();
        achievementSystem.loadAchievements();
        const newAchievements = achievementSystem.checkAchievements(streak, entries.length);
        
        // Show achievement notifications
        if (newAchievements.length > 0) {
          console.log(`🏆 ${newAchievements.length} new achievement(s) unlocked`);
          // TODO: Replace with proper toast notification system
        }
        
        // Check if user has entry today
        const todayEntry = findTodayEntry(entries);
        
        if (todayEntry) {
          setTodayMood(todayEntry.mood);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Set up online/offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user?.id, calculateStreak]);

  const stripHtml = (html: string): string => {
    if (typeof window === 'undefined' || !html) return html || '';
    // Use DOMParser for safe HTML parsing
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.textContent || doc.body.innerText || '';
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return html.replace(/<[^>]*>/g, ''); // Fallback: strip tags with regex
    }
  };

  const findTodayEntry = (entries: JournalEntry[]): JournalEntry | undefined => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return entries.find(e => {
      const entryDate = new Date(e.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  };

  const handleMoodSelect = async (tagId: string, label: string) => {
    try {
      const mood = label.toLowerCase() as MoodTag;
      setTodayMood(mood);
      
      // Check if there's already an entry today
      const allEntries = await entryRepository.list();
      const todayEntry = findTodayEntry(allEntries);
      
      if (todayEntry) {
        // Update existing entry's mood
        await entryRepository.update(todayEntry.id, { mood });
      }
      // If no entry today, the mood will be used when they create a new entry
    } catch (error) {
      console.error('Error updating mood:', error);
      // Revert mood selection on error
      setTodayMood(undefined);
    }
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - entryDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-peaceful-text text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peaceful-bg p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-12 gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-peaceful-text mb-2">{getGreeting()}</h1>
            <p className="text-peaceful-text/70 text-base md:text-lg font-sans">Your private space for reflection</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Link href="/profile" className="text-peaceful-text hover:text-peaceful-accent p-2 rounded-lg hover:bg-white/20 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>
            <Link href="/analytics" className="text-peaceful-text hover:text-peaceful-accent p-2 rounded-lg hover:bg-white/20 transition-colors">
              <AnalyticsIcon className="w-6 h-6" />
            </Link>
            <Link href="/settings" className="text-peaceful-text hover:text-peaceful-accent p-2 rounded-lg hover:bg-white/20 transition-colors">
              <SettingsIcon className="w-6 h-6" />
            </Link>
            {currentStreak > 0 && (
              <div className="bg-peaceful-warm/80 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 flex items-center gap-2">
                <StreakIcon className="w-4 h-4 text-peaceful-text" />
                <span className="text-sm font-medium text-peaceful-text">{currentStreak} {currentStreak === 1 ? 'day' : 'days'} streak</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Offline Indicator */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 backdrop-blur-md border border-white/30 text-peaceful-text px-6 py-3 rounded-full text-center text-sm shadow-lg"
          >
            <OfflineIcon className="w-4 h-4 inline mr-2" />
            Offline Mode - Your entries are saved locally
          </motion.div>
        )}



        {/* Today's Mood Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-4 md:p-8 shadow-glass"
        >
          <h2 className="text-xl md:text-2xl font-serif font-semibold text-peaceful-text mb-4 md:mb-6">How are you feeling today?</h2>
          <MoodSelector selectedMood={todayMood} onMoodSelect={handleMoodSelect} />
        </motion.div>



        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-4 md:p-8 shadow-glass"
          >
            <h2 className="text-xl md:text-2xl font-serif font-semibold text-peaceful-text mb-4 md:mb-6">Recent Entries</h2>
            <div className="space-y-3">
              {recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link href={`/entry/${entry.id}`}>
                    <div className="p-3 md:p-5 bg-white/25 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200 cursor-pointer border border-white/20 hover:border-white/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-peaceful-text/60">{formatDate(entry.createdAt)}</span>
                        <div className="w-6 h-6">
                          {entry.mood === 'joy' && <JoyIcon className="w-6 h-6" />}
                          {entry.mood === 'calm' && <CalmIcon className="w-6 h-6" />}
                          {entry.mood === 'reflective' && <ReflectiveIcon className="w-6 h-6" />}
                          {entry.mood === 'sad' && <SadIcon className="w-6 h-6" />}
                        </div>
                      </div>
                      <p className="text-peaceful-text line-clamp-2">
                        {entry.excerpt}
                        {entry.excerpt.length >= 100 && '...'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {recentEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-6 md:p-12 shadow-glass text-center"
          >
            <div className="mb-4">
              <JournalIcon className="w-20 h-20 mx-auto text-peaceful-text/60" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-peaceful-text mb-3">Start Your Journey</h3>
            <p className="text-peaceful-text/70 text-base md:text-lg">
              Create your first entry to begin tracking your thoughts and moods
            </p>
          </motion.div>
        )}
      </div>
      <FloatingActionButton />
    </div>
  );
}
