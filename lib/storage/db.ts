import Dexie, { Table } from 'dexie';

// Types for database records
export interface JournalEntry {
  id: string;
  userId: string;
  content: string; // Rich text HTML
  mood: MoodTag;
  photos: LocalPhoto[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  encrypted: boolean;
}

export type MoodTag = 'joy' | 'calm' | 'reflective' | 'sad';

export interface LocalPhoto {
  id: string;
  dataUrl: string; // Base64 encoded
  caption?: string;
  addedAt: Date;
}

export interface PhotoRecord {
  id: string;
  entryId: string;
  dataUrl: string;
  caption?: string;
  addedAt: Date;
}

export interface SettingRecord {
  key: string;
  value: any;
}

// Database class
export class CalmJournalDB extends Dexie {
  entries!: Table<JournalEntry, string>;
  photos!: Table<PhotoRecord, string>;
  settings!: Table<SettingRecord, string>;

  constructor() {
    super('CalmJournalDB');
    
    this.version(1).stores({
      entries: 'id, userId, createdAt, updatedAt, mood, [userId+createdAt]',
      photos: 'id, entryId, addedAt',
      settings: 'key'
    });
  }
}

// Export singleton instance
export const db = new CalmJournalDB();
