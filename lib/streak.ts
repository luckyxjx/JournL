import { EntryRepository } from './storage/EntryRepository';

export class StreakService {
  private entryRepo = new EntryRepository();

  async calculateCurrentStreak(userId: string): Promise<number> {
    const entries = await this.entryRepo.list();
    if (!entries.length) return 0;

    const dates = [...new Set(entries.map(e => e.createdAt.toISOString().split('T')[0]))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let streak = 0;
    let currentDate = dates.includes(today) ? today : dates.includes(yesterday) ? yesterday : null;
    if (!currentDate) return 0;

    for (const date of dates) {
      if (date === currentDate) {
        streak++;
        currentDate = new Date(new Date(currentDate).getTime() - 86400000).toISOString().split('T')[0];
      } else if (date < currentDate) break;
    }
    return streak;
  }

  async calculateLongestStreak(userId: string): Promise<number> {
    const entries = await this.entryRepo.list();
    if (!entries.length) return 0;

    const dates = [...new Set(entries.map(e => e.createdAt.toISOString().split('T')[0]))].sort();
    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    return Math.max(longestStreak, currentStreak);
  }

  async updateStreak(userId: string): Promise<number> {
    const streak = await this.calculateCurrentStreak(userId);
    localStorage.setItem(`streak_${userId}`, streak.toString());
    
    if (userId && !userId.startsWith('guest_')) {
      const sync = new (await import('./sync')).MetadataSync();
      await sync.syncStreak(userId, streak);
    }
    
    return streak;
  }
}