export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'entries';
  threshold: number;
  earned: boolean;
  earnedAt?: Date;
}

export class AchievementSystem {
  private achievements: Achievement[] = [
    { id: 'streak_3', title: '3 Day Streak', description: 'Write for 3 consecutive days', type: 'streak', threshold: 3, earned: false },
    { id: 'streak_7', title: 'Week Warrior', description: 'Write for 7 consecutive days', type: 'streak', threshold: 7, earned: false },
    { id: 'streak_30', title: 'Monthly Master', description: 'Write for 30 consecutive days', type: 'streak', threshold: 30, earned: false },
    { id: 'entries_10', title: 'Getting Started', description: 'Write 10 journal entries', type: 'entries', threshold: 10, earned: false },
    { id: 'entries_50', title: 'Dedicated Writer', description: 'Write 50 journal entries', type: 'entries', threshold: 50, earned: false },
    { id: 'entries_100', title: 'Century Club', description: 'Write 100 journal entries', type: 'entries', threshold: 100, earned: false }
  ];

  checkAchievements(streak: number, entryCount: number): Achievement[] {
    const newlyEarned: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (!achievement.earned) {
        const shouldEarn = achievement.type === 'streak' 
          ? streak >= achievement.threshold 
          : entryCount >= achievement.threshold;
          
        if (shouldEarn) {
          achievement.earned = true;
          achievement.earnedAt = new Date();
          newlyEarned.push(achievement);
        }
      }
    });

    this.saveAchievements();
    return newlyEarned;
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  private saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
  }

  loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      this.achievements = JSON.parse(saved);
    }
  }
}