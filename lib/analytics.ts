import { EntryRepository } from './storage/EntryRepository';

export class AnalyticsEngine {
  private entryRepo = new EntryRepository();

  async getWeeklyMoodData(userId: string) {
    const entries = await this.entryRepo.list();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekEntries = entries.filter(e => e.createdAt >= weekAgo);
    
    const moodCounts = weekEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }));
  }

  async getMonthlyTrend(userId: string) {
    const entries = await this.entryRepo.list();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthEntries = entries.filter(e => e.createdAt >= monthAgo);
    
    const dailyCounts = monthEntries.reduce((acc, entry) => {
      const date = entry.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
  }

  async getWritingFrequency(userId: string) {
    const entries = await this.entryRepo.list();
    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const yearEntries = entries.filter(e => e.createdAt >= yearAgo);
    
    return yearEntries.reduce((acc, entry) => {
      const date = entry.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  async getEmotionStats(userId: string) {
    const entries = await this.entryRepo.list();
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood, count, percentage: Math.round((count / total) * 100)
    }));
  }
}