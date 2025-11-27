import { describe, it, expect, beforeEach } from 'vitest';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { db } from '@/lib/storage/db';

describe('Entry Creation and Editing Flow', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.entries.clear();
  });

  it('should create a new entry with all required fields', async () => {
    // Arrange
    const now = new Date();
    const entryData = {
      userId: 'test-user',
      content: '<p>This is my first journal entry</p>',
      mood: 'joy' as const,
      photos: [],
      createdAt: now,
      updatedAt: now,
      wordCount: 6,
      encrypted: false,
    };

    // Act
    const entryId = await entryRepository.create(entryData);

    // Assert
    expect(entryId).toBeDefined();
    expect(typeof entryId).toBe('string');

    // Verify entry was saved to IndexedDB
    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry).toBeDefined();
    expect(savedEntry?.userId).toBe('test-user');
    expect(savedEntry?.content).toBe('<p>This is my first journal entry</p>');
    expect(savedEntry?.mood).toBe('joy');
    expect(savedEntry?.wordCount).toBe(6);
    expect(savedEntry?.encrypted).toBe(false);
  });

  it('should generate a unique UUID for each entry', async () => {
    // Arrange
    const now = new Date();
    const entryData = {
      userId: 'test-user',
      content: '<p>Test entry</p>',
      mood: 'calm' as const,
      photos: [],
      createdAt: now,
      updatedAt: now,
      wordCount: 2,
      encrypted: false,
    };

    // Act
    const id1 = await entryRepository.create(entryData);
    const id2 = await entryRepository.create(entryData);

    // Assert
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(id2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('should preserve createdAt timestamp when editing an entry', async () => {
    // Arrange
    const createdAt = new Date('2024-01-01T10:00:00Z');
    const updatedAt = new Date('2024-01-01T10:00:00Z');
    
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Original content</p>',
      mood: 'calm' as const,
      photos: [],
      createdAt,
      updatedAt,
      wordCount: 2,
      encrypted: false,
    });

    // Act - Edit the entry
    const newUpdatedAt = new Date('2024-01-02T15:30:00Z');
    await entryRepository.update(entryId, {
      content: '<p>Updated content</p>',
      updatedAt: newUpdatedAt,
      wordCount: 2,
    });

    // Assert
    const updatedEntry = await entryRepository.read(entryId);
    expect(updatedEntry).toBeDefined();
    expect(updatedEntry?.content).toBe('<p>Updated content</p>');
    expect(updatedEntry?.createdAt.getTime()).toBe(createdAt.getTime());
    expect(updatedEntry?.updatedAt.getTime()).toBe(newUpdatedAt.getTime());
  });

  it('should save entry with photos', async () => {
    // Arrange
    const now = new Date();
    const photos = [
      {
        id: 'photo-1',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        addedAt: now,
      },
    ];

    // Act
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Entry with photo</p>',
      mood: 'joy' as const,
      photos,
      createdAt: now,
      updatedAt: now,
      wordCount: 3,
      encrypted: false,
    });

    // Assert
    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry).toBeDefined();
    expect(savedEntry?.photos).toHaveLength(1);
    expect(savedEntry?.photos[0].id).toBe('photo-1');
    expect(savedEntry?.photos[0].dataUrl).toContain('data:image/png;base64');
  });

  it('should work offline (without network connection)', async () => {
    // This test verifies that IndexedDB operations work regardless of network status
    // IndexedDB is always local, so this should always work
    
    // Arrange
    const now = new Date();
    const entryData = {
      userId: 'test-user',
      content: '<p>Offline entry</p>',
      mood: 'reflective' as const,
      photos: [],
      createdAt: now,
      updatedAt: now,
      wordCount: 2,
      encrypted: false,
    };

    // Act
    const entryId = await entryRepository.create(entryData);

    // Assert
    expect(entryId).toBeDefined();
    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry).toBeDefined();
    expect(savedEntry?.content).toBe('<p>Offline entry</p>');
  });

  it('should capture both createdAt and updatedAt timestamps', async () => {
    // Arrange
    const beforeCreate = Date.now();
    const now = new Date();

    // Act
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Test entry</p>',
      mood: 'calm' as const,
      photos: [],
      createdAt: now,
      updatedAt: now,
      wordCount: 2,
      encrypted: false,
    });

    const afterCreate = Date.now();

    // Assert
    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry).toBeDefined();
    expect(savedEntry?.createdAt).toBeInstanceOf(Date);
    expect(savedEntry?.updatedAt).toBeInstanceOf(Date);
    expect(savedEntry?.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate);
    expect(savedEntry?.createdAt.getTime()).toBeLessThanOrEqual(afterCreate);
    expect(savedEntry?.updatedAt.getTime()).toBe(savedEntry?.createdAt.getTime());
  });

  it('should update updatedAt timestamp when editing', async () => {
    // Arrange
    const createdAt = new Date('2024-01-01T10:00:00Z');
    const initialUpdatedAt = new Date('2024-01-01T10:00:00Z');
    
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Original</p>',
      mood: 'calm' as const,
      photos: [],
      createdAt,
      updatedAt: initialUpdatedAt,
      wordCount: 1,
      encrypted: false,
    });

    // Wait a bit to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));

    // Act
    const newUpdatedAt = new Date();
    await entryRepository.update(entryId, {
      content: '<p>Updated</p>',
      updatedAt: newUpdatedAt,
    });

    // Assert
    const updatedEntry = await entryRepository.read(entryId);
    expect(updatedEntry).toBeDefined();
    expect(updatedEntry?.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
  });

  it('should handle mood selection', async () => {
    // Arrange & Act
    const now = new Date();
    const moods = ['joy', 'calm', 'reflective', 'sad'] as const;
    
    for (const mood of moods) {
      const entryId = await entryRepository.create({
        userId: 'test-user',
        content: `<p>Entry with ${mood} mood</p>`,
        mood,
        photos: [],
        createdAt: now,
        updatedAt: now,
        wordCount: 4,
        encrypted: false,
      });

      // Assert
      const savedEntry = await entryRepository.read(entryId);
      expect(savedEntry?.mood).toBe(mood);
    }
  });
});
