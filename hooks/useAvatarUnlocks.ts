'use client';

import { useState, useCallback } from 'react';
import { AvatarSystem } from '@/lib/core/user/avatar.service';
import { AvatarItem, UserStats } from '@/lib/types/avatar';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { StreakService } from '@/lib/core/journal/streak.service';

export function useAvatarUnlocks() {
  const [newUnlocks, setNewUnlocks] = useState<AvatarItem[]>([]);

  const checkForUnlocks = useCallback(async (userId: string) => {
    try {
      // Get current stats
      const entries = await entryRepository.list();
      const streakService = new StreakService();
      const currentStreak = await streakService.calculateCurrentStreak(userId);
      const longestStreak = await streakService.calculateLongestStreak(userId);
      
      // Calculate stats
      const totalWords = entries.reduce((sum, entry) => {
        const wordCount = entry.content ? entry.content.split(/\s+/).filter(word => word.length > 0).length : 0;
        return sum + wordCount;
      }, 0);
      
      const moodCounts: Record<string, number> = { joy: 0, calm: 0, reflective: 0, sad: 0 };
      entries.forEach(entry => {
        if (entry.mood) moodCounts[entry.mood]++;
      });
      
      const stats: UserStats = {
        currentStreak,
        longestStreak,
        totalEntries: entries.length,
        totalWords,
        moodCounts,
        hasPhotoAttachments: entries.some(entry => entry.photos && entry.photos.length > 0),
        averageEntryLength: entries.length > 0 ? Math.round(totalWords / entries.length) : 0,
        moodVariety: Object.keys(moodCounts).filter(mood => moodCounts[mood] > 0).length,
        weekendEntries: entries.filter(entry => {
          const date = new Date(entry.createdAt);
          return date.getDay() === 0 || date.getDay() === 6;
        }).length,
        nightEntries: entries.filter(entry => {
          const date = new Date(entry.createdAt);
          return date.getHours() >= 22 || date.getHours() <= 5;
        }).length
      };
      
      // Check for new unlocks
      const unlocks = AvatarSystem.checkUnlocks(stats);
      if (unlocks.length > 0) {
        setNewUnlocks(unlocks);
        return unlocks;
      }
      
      return [];
    } catch (error) {
      console.error('Error checking avatar unlocks:', error);
      return [];
    }
  }, []);

  const clearUnlocks = useCallback(() => {
    setNewUnlocks([]);
  }, []);

  return {
    newUnlocks,
    checkForUnlocks,
    clearUnlocks
  };
}