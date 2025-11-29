export type AvatarItemType = 'eyes' | 'hat' | 'accessory' | 'background';

export interface AvatarItem {
  id: string;
  type: AvatarItemType;
  name: string;
  unlockCondition: AvatarUnlockCondition;
  svgComponent: string; // SVG path or component identifier
}

export interface UserAvatar {
  eyes?: string;
  hat?: string;
  accessory?: string;
  background?: string;
}

export interface AvatarUnlockCondition {
  type: 'streak' | 'wordCount' | 'mood' | 'content' | 'seasonal' | 'combo';
  threshold: number;
  moodType?: 'joy' | 'calm' | 'reflective' | 'sad';
  description: string;
  seasonal?: {
    startDate: string;
    endDate: string;
    event: string;
  };
  combo?: {
    streakMin: number;
    wordMin: number;
    moodVariety: number;
  };
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  totalWords: number;
  moodCounts: Record<string, number>;
  hasPhotoAttachments: boolean;
  averageEntryLength: number;
  moodVariety: number;
  weekendEntries: number;
  nightEntries: number;
}

export interface AvatarAnimation {
  type: 'bounce' | 'glow' | 'sparkle' | 'float';
  duration: number;
  trigger: 'unlock' | 'equip' | 'hover';
}

