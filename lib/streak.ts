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