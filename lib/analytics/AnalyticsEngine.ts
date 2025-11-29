import { entryRepository } from '@/lib/storage/EntryRepository';
import { MoodTag } from '@/components/features/Journal/MoodSelector';

export interface MoodData {
  mood: MoodTag;
  count: number;
}

export interface WeeklyData {
  day: string;
  joy: number;
  calm: number;
  reflective: number;
  sad: number;
}

export class AnalyticsEngine {
  static async getMoodDistribution(): Promise<MoodData[]> {
    const entries = await entryRepository.list();
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodTag, number>);

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood as MoodTag,
      count
    }));
  }

  static async getWeeklyMoodChart(): Promise<WeeklyData[]> {
    const entries = await entryRepository.list();
    const now = new Date();
    const weekData: WeeklyData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const moodCounts = dayEntries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {} as Record<MoodTag, number>);

      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        joy: moodCounts.joy || 0,
        calm: moodCounts.calm || 0,
        reflective: moodCounts.reflective || 0,
        sad: moodCounts.sad || 0,
      });
    }

    return weekData;
  }

  static async getWritingFrequency(): Promise<{ date: string; count: number }[]> {
    const entries = await entryRepository.list();
    const frequencyMap = entries.reduce((acc, entry) => {
      const date = entry.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(frequencyMap).map(([date, count]) => ({
      date,
      count
    }));
  }
}