import { AvatarItem, UserAvatar, UserStats, AvatarUnlockCondition } from '../../types/avatar';

export class AvatarSystem {
  private static readonly STORAGE_KEY = 'user_avatar';
  private static readonly UNLOCKED_ITEMS_KEY = 'unlocked_avatar_items';

  private static readonly AVATAR_ITEMS: AvatarItem[] = [
    // Eyes - Streak Based
    { id: 'happy_eyes', type: 'eyes', name: 'Happy Eyes', unlockCondition: { type: 'streak', threshold: 7, description: '7 day streak' }, svgComponent: 'happy' },
    { id: 'sunglasses', type: 'eyes', name: 'Cool Sunglasses', unlockCondition: { type: 'streak', threshold: 10, description: '10 day streak' }, svgComponent: 'sunglasses' },
    { id: 'thoughtful_glasses', type: 'eyes', name: 'Thoughtful Glasses', unlockCondition: { type: 'mood', threshold: 10, moodType: 'reflective', description: '10 reflective entries' }, svgComponent: 'glasses' },
    { id: 'caring_eyes', type: 'eyes', name: 'Caring Eyes', unlockCondition: { type: 'mood', threshold: 5, moodType: 'sad', description: '5 sad entries' }, svgComponent: 'caring' },

    // Hats - Word Count Based
    { id: 'simple_hat', type: 'hat', name: 'Simple Hat', unlockCondition: { type: 'wordCount', threshold: 500, description: '500 total words' }, svgComponent: 'simple_hat' },
    { id: 'fancy_hat', type: 'hat', name: 'Fancy Hat', unlockCondition: { type: 'wordCount', threshold: 1000, description: '1000 total words' }, svgComponent: 'fancy_hat' },
    { id: 'writers_beret', type: 'hat', name: "Writer's Beret", unlockCondition: { type: 'wordCount', threshold: 5000, description: '5000 total words' }, svgComponent: 'beret' },
    { id: 'graduation_cap', type: 'hat', name: 'Graduation Cap', unlockCondition: { type: 'wordCount', threshold: 10000, description: '10000 total words' }, svgComponent: 'grad_cap' },
    { id: 'crown', type: 'hat', name: 'Royal Crown', unlockCondition: { type: 'streak', threshold: 30, description: '30 day streak' }, svgComponent: 'crown' },

    // Accessories - Mixed Conditions
    { id: 'camera', type: 'accessory', name: 'Camera', unlockCondition: { type: 'content', threshold: 1, description: 'Add photo to entry' }, svgComponent: 'camera' },
    { id: 'pen_ear', type: 'accessory', name: 'Pen Behind Ear', unlockCondition: { type: 'streak', threshold: 14, description: '14 day streak' }, svgComponent: 'pen' },
    { id: 'scroll', type: 'accessory', name: 'Ancient Scroll', unlockCondition: { type: 'wordCount', threshold: 2000, description: '2000 total words' }, svgComponent: 'scroll' },

    // Special Effects
    { id: 'golden_aura', type: 'background', name: 'Golden Aura', unlockCondition: { type: 'streak', threshold: 100, description: '100 day streak' }, svgComponent: 'aura' },
    
    // Phase 2: Seasonal Items
    { id: 'santa_hat', type: 'hat', name: 'Santa Hat', unlockCondition: { type: 'seasonal', threshold: 1, description: 'Write during December', seasonal: { startDate: '12-01', endDate: '12-31', event: 'Winter Holidays' } }, svgComponent: 'santa_hat' },
    { id: 'party_hat', type: 'hat', name: 'Party Hat', unlockCondition: { type: 'seasonal', threshold: 1, description: 'Write on New Year', seasonal: { startDate: '12-31', endDate: '01-02', event: 'New Year' } }, svgComponent: 'party_hat' },
    { id: 'heart_eyes', type: 'eyes', name: 'Heart Eyes', unlockCondition: { type: 'seasonal', threshold: 1, description: 'Write in February', seasonal: { startDate: '02-01', endDate: '02-29', event: 'Love Month' } }, svgComponent: 'heart_eyes' },
    
    // Phase 2: Advanced Unlocks
    { id: 'rainbow_aura', type: 'background', name: 'Rainbow Aura', unlockCondition: { type: 'combo', threshold: 1, description: 'Master journaler', combo: { streakMin: 50, wordMin: 5000, moodVariety: 4 } }, svgComponent: 'rainbow_aura' },
    { id: 'wizard_hat', type: 'hat', name: 'Wizard Hat', unlockCondition: { type: 'wordCount', threshold: 25000, description: '25000 total words' }, svgComponent: 'wizard_hat' },
    { id: 'night_owl_eyes', type: 'eyes', name: 'Night Owl Eyes', unlockCondition: { type: 'content', threshold: 10, description: '10 late night entries' }, svgComponent: 'owl_eyes' },
    { id: 'weekend_warrior', type: 'accessory', name: 'Weekend Badge', unlockCondition: { type: 'content', threshold: 20, description: '20 weekend entries' }, svgComponent: 'badge' },
  ];

  static getAvailableItems(): AvatarItem[] {
    return [...this.AVATAR_ITEMS];
  }

  static checkUnlocks(stats: UserStats): AvatarItem[] {
    const currentlyUnlocked = this.getUnlockedItems();
    const newUnlocks: AvatarItem[] = [];

    this.AVATAR_ITEMS.forEach(item => {
      if (currentlyUnlocked.includes(item.id)) return;

      const isUnlocked = this.checkUnlockCondition(item.unlockCondition, stats);
      if (isUnlocked) {
        newUnlocks.push(item);
        this.unlockItem(item.id);
      }
    });

    return newUnlocks;
  }

  private static checkUnlockCondition(condition: AvatarUnlockCondition, stats: UserStats): boolean {
    switch (condition.type) {
      case 'streak':
        return stats.currentStreak >= condition.threshold;
      case 'wordCount':
        return stats.totalWords >= condition.threshold;
      case 'mood':
        if (!condition.moodType) return false;
        return (stats.moodCounts[condition.moodType] || 0) >= condition.threshold;
      case 'content':
        if (condition.description.includes('late night')) return stats.nightEntries >= condition.threshold;
        if (condition.description.includes('weekend')) return stats.weekendEntries >= condition.threshold;
        return stats.hasPhotoAttachments;
      case 'seasonal':
        if (!condition.seasonal) return false;
        const now = new Date();
        const currentDate = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        return currentDate >= condition.seasonal.startDate && currentDate <= condition.seasonal.endDate;
      case 'combo':
        if (!condition.combo) return false;
        return stats.currentStreak >= condition.combo.streakMin && 
               stats.totalWords >= condition.combo.wordMin && 
               stats.moodVariety >= condition.combo.moodVariety;
      default:
        return false;
    }
  }

  static getUserAvatar(): UserAvatar {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  }

  static updateUserAvatar(avatar: UserAvatar): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(avatar));
  }

  static getUnlockedItems(): string[] {
    const saved = localStorage.getItem(this.UNLOCKED_ITEMS_KEY);
    const unlocked = saved ? JSON.parse(saved) : [];
    
    // Temporarily unlock all items for testing
    const allItemIds = [
      'happy_eyes', 'sunglasses', 'thoughtful_glasses', 'caring_eyes', 'heart_eyes', 'night_owl_eyes',
      'simple_hat', 'fancy_hat', 'writers_beret', 'graduation_cap', 'crown', 'santa_hat', 'party_hat', 'wizard_hat',
      'camera', 'pen_ear', 'scroll', 'weekend_warrior',
      'golden_aura', 'rainbow_aura'
    ];
    
    return allItemIds;
  }

  private static unlockItem(itemId: string): void {
    const unlocked = this.getUnlockedItems();
    if (!unlocked.includes(itemId)) {
      unlocked.push(itemId);
      localStorage.setItem(this.UNLOCKED_ITEMS_KEY, JSON.stringify(unlocked));
    }
  }

  static getUnlockedItemsByType(type: string): AvatarItem[] {
    const unlockedIds = this.getUnlockedItems();
    return this.AVATAR_ITEMS.filter(item => 
      item.type === type && unlockedIds.includes(item.id)
    );
  }

  static getProgressToNextUnlock(stats: UserStats): { item: AvatarItem; progress: number }[] {
    const unlocked = this.getUnlockedItems();
    const progress: { item: AvatarItem; progress: number }[] = [];

    this.AVATAR_ITEMS.forEach(item => {
      if (unlocked.includes(item.id)) return;

      let currentProgress = 0;
      const condition = item.unlockCondition;

      switch (condition.type) {
        case 'streak':
          currentProgress = Math.min(stats.currentStreak / condition.threshold, 1);
          break;
        case 'wordCount':
          currentProgress = Math.min(stats.totalWords / condition.threshold, 1);
          break;
        case 'mood':
          if (condition.moodType) {
            currentProgress = Math.min((stats.moodCounts[condition.moodType] || 0) / condition.threshold, 1);
          }
          break;
        case 'content':
          currentProgress = stats.hasPhotoAttachments ? 1 : 0;
          break;
      }

      if (currentProgress > 0 && currentProgress < 1) {
        progress.push({ item, progress: currentProgress });
      }
    });

    return progress.sort((a, b) => b.progress - a.progress);
  }
}