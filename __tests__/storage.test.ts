import { describe, it, expect, beforeEach } from 'vitest';
import { db, entryRepository, JournalEntry } from '../lib/storage';

describe('IndexedDB Storage Layer', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.entries.clear();
    await db.photos.clear();
    await db.settings.clear();
  });

  describe('EntryRepository', () => {
    it('should create a new entry', async () => {
      const entryData: Omit<JournalEntry, 'id'> = {
        userId: 'test-user',
        content: 'Test entry content',
        mood: 'calm',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 3,
        encrypted: false,
      };

      const id = await entryRepository.create(entryData);
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
    });

    it('should read an entry by id', async () => {
      const entryData: Omit<JournalEntry, 'id'> = {
        userId: 'test-user',
        content: 'Test entry content',
        mood: 'joy',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 3,
        encrypted: false,
      };

      const id = await entryRepository.create(entryData);
      const entry = await entryRepository.read(id);

      expect(entry).toBeDefined();
      expect(entry?.id).toBe(id);
      expect(entry?.content).toBe('Test entry content');
      expect(entry?.mood).toBe('joy');
    });

    it('should update an entry', async () => {
      const entryData: Omit<JournalEntry, 'id'> = {
        userId: 'test-user',
        content: 'Original content',
        mood: 'calm',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 2,
        encrypted: false,
      };

      const id = await entryRepository.create(entryData);
      
      await entryRepository.update(id, {
        content: 'Updated content',
        updatedAt: new Date(),
      });

      const updated = await entryRepository.read(id);
      expect(updated?.content).toBe('Updated content');
    });

    it('should delete an entry', async () => {
      const entryData: Omit<JournalEntry, 'id'> = {
        userId: 'test-user',
        content: 'Test entry',
        mood: 'reflective',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 2,
        encrypted: false,
      };

      const id = await entryRepository.create(entryData);
      await entryRepository.delete(id);

      const deleted = await entryRepository.read(id);
      expect(deleted).toBeNull();
    });

    it('should list entries with sorting', async () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      await entryRepository.create({
        userId: 'test-user',
        content: 'Entry 1',
        mood: 'calm',
        photos: [],
        createdAt: yesterday,
        updatedAt: yesterday,
        wordCount: 2,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'test-user',
        content: 'Entry 2',
        mood: 'joy',
        photos: [],
        createdAt: now,
        updatedAt: now,
        wordCount: 2,
        encrypted: false,
      });

      const entries = await entryRepository.list({ sortOrder: 'desc' });
      
      expect(entries).toHaveLength(2);
      expect(entries[0].content).toBe('Entry 2');
      expect(entries[1].content).toBe('Entry 1');
    });

    it('should filter entries by mood', async () => {
      await entryRepository.create({
        userId: 'test-user',
        content: 'Calm entry',
        mood: 'calm',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 2,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'test-user',
        content: 'Joyful entry',
        mood: 'joy',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 2,
        encrypted: false,
      });

      const calmEntries = await entryRepository.list({ moodFilter: ['calm'] });
      
      expect(calmEntries).toHaveLength(1);
      expect(calmEntries[0].mood).toBe('calm');
    });

    it('should search entries by content', async () => {
      await entryRepository.create({
        userId: 'test-user',
        content: 'Today was a wonderful day',
        mood: 'joy',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 5,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'test-user',
        content: 'Feeling peaceful and calm',
        mood: 'calm',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 4,
        encrypted: false,
      });

      const results = await entryRepository.search('wonderful');
      
      expect(results).toHaveLength(1);
      expect(results[0].content).toContain('wonderful');
    });

    it('should support pagination', async () => {
      // Create 5 entries
      for (let i = 0; i < 5; i++) {
        await entryRepository.create({
          userId: 'test-user',
          content: `Entry ${i}`,
          mood: 'calm',
          photos: [],
          createdAt: new Date(Date.now() + i * 1000),
          updatedAt: new Date(Date.now() + i * 1000),
          wordCount: 2,
          encrypted: false,
        });
      }

      const page1 = await entryRepository.list({ limit: 2, offset: 0 });
      const page2 = await entryRepository.list({ limit: 2, offset: 2 });

      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(2);
      expect(page1[0].content).not.toBe(page2[0].content);
    });
  });

  describe('Database indexes', () => {
    it('should have userId index for efficient querying', async () => {
      // Create entries for different users
      await entryRepository.create({
        userId: 'user-1',
        content: 'User 1 entry',
        mood: 'calm',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 3,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'user-2',
        content: 'User 2 entry',
        mood: 'joy',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 3,
        encrypted: false,
      });

      // Query by userId using Dexie's where clause
      const user1Entries = await db.entries.where('userId').equals('user-1').toArray();
      
      expect(user1Entries).toHaveLength(1);
      expect(user1Entries[0].userId).toBe('user-1');
    });

    it('should have createdAt index for date-based queries', async () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');

      await entryRepository.create({
        userId: 'test-user',
        content: 'Entry 1',
        mood: 'calm',
        photos: [],
        createdAt: date1,
        updatedAt: date1,
        wordCount: 2,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'test-user',
        content: 'Entry 2',
        mood: 'joy',
        photos: [],
        createdAt: date2,
        updatedAt: date2,
        wordCount: 2,
        encrypted: false,
      });

      // Query by createdAt
      const entriesOnDate1 = await db.entries.where('createdAt').equals(date1).toArray();
      
      expect(entriesOnDate1).toHaveLength(1);
      expect(entriesOnDate1[0].content).toBe('Entry 1');
    });

    it('should have mood index for filtering', async () => {
      await entryRepository.create({
        userId: 'test-user',
        content: 'Calm entry',
        mood: 'calm',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 2,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'test-user',
        content: 'Joyful entry',
        mood: 'joy',
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        wordCount: 2,
        encrypted: false,
      });

      // Query by mood
      const calmEntries = await db.entries.where('mood').equals('calm').toArray();
      
      expect(calmEntries).toHaveLength(1);
      expect(calmEntries[0].mood).toBe('calm');
    });

    it('should have compound index for userId+createdAt', async () => {
      const date = new Date('2024-01-01');

      await entryRepository.create({
        userId: 'user-1',
        content: 'User 1 entry',
        mood: 'calm',
        photos: [],
        createdAt: date,
        updatedAt: date,
        wordCount: 3,
        encrypted: false,
      });

      await entryRepository.create({
        userId: 'user-2',
        content: 'User 2 entry',
        mood: 'joy',
        photos: [],
        createdAt: date,
        updatedAt: date,
        wordCount: 3,
        encrypted: false,
      });

      // Query by compound index
      const entries = await db.entries.where('[userId+createdAt]').equals(['user-1', date]).toArray();
      
      expect(entries).toHaveLength(1);
      expect(entries[0].userId).toBe('user-1');
    });
  });
});
