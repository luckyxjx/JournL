import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { db, LocalPhoto } from '@/lib/storage/db';

describe('Photo Storage Integration', () => {
  const testUserId = 'test-user-123';

  beforeEach(async () => {
    // Clear database before each test
    await db.entries.clear();
    await db.photos.clear();
  });

  afterEach(async () => {
    // Clean up after each test
    await db.entries.clear();
    await db.photos.clear();
  });

  it('should store entry with photos in IndexedDB', async () => {
    const photos: LocalPhoto[] = [
      {
        id: 'photo-1',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        addedAt: new Date(),
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Test entry with photo</p>',
      mood: 'joy',
      photos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 4,
      encrypted: false,
    });

    // Verify entry was created
    expect(entryId).toBeDefined();

    // Retrieve entry
    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry).toBeDefined();
    expect(savedEntry?.photos).toHaveLength(1);
    expect(savedEntry?.photos[0].id).toBe('photo-1');
    expect(savedEntry?.photos[0].dataUrl).toContain('data:image/png;base64');
  });

  it('should store multiple photos with entry', async () => {
    const photos: LocalPhoto[] = [
      {
        id: 'photo-1',
        dataUrl: 'data:image/png;base64,photo1data',
        addedAt: new Date('2024-01-01'),
      },
      {
        id: 'photo-2',
        dataUrl: 'data:image/jpeg;base64,photo2data',
        addedAt: new Date('2024-01-02'),
      },
      {
        id: 'photo-3',
        dataUrl: 'data:image/png;base64,photo3data',
        addedAt: new Date('2024-01-03'),
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Entry with multiple photos</p>',
      mood: 'calm',
      photos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 4,
      encrypted: false,
    });

    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry?.photos).toHaveLength(3);
    expect(savedEntry?.photos[0].id).toBe('photo-1');
    expect(savedEntry?.photos[1].id).toBe('photo-2');
    expect(savedEntry?.photos[2].id).toBe('photo-3');
  });

  it('should update entry photos', async () => {
    const initialPhotos: LocalPhoto[] = [
      {
        id: 'photo-1',
        dataUrl: 'data:image/png;base64,initial',
        addedAt: new Date(),
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Test entry</p>',
      mood: 'reflective',
      photos: initialPhotos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 2,
      encrypted: false,
    });

    // Add more photos
    const updatedPhotos: LocalPhoto[] = [
      ...initialPhotos,
      {
        id: 'photo-2',
        dataUrl: 'data:image/png;base64,added',
        addedAt: new Date(),
      },
    ];

    await entryRepository.update(entryId, {
      photos: updatedPhotos,
      updatedAt: new Date(),
    });

    const updatedEntry = await entryRepository.read(entryId);
    expect(updatedEntry?.photos).toHaveLength(2);
  });

  it('should delete photos when entry is deleted', async () => {
    const photos: LocalPhoto[] = [
      {
        id: 'photo-1',
        dataUrl: 'data:image/png;base64,test',
        addedAt: new Date(),
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Test entry</p>',
      mood: 'sad',
      photos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 2,
      encrypted: false,
    });

    // Delete entry
    await entryRepository.delete(entryId);

    // Verify entry is deleted
    const deletedEntry = await entryRepository.read(entryId);
    expect(deletedEntry).toBeNull();
  });

  it('should handle entry with no photos', async () => {
    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Entry without photos</p>',
      mood: 'joy',
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 3,
      encrypted: false,
    });

    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry?.photos).toHaveLength(0);
  });

  it('should preserve photo metadata', async () => {
    const addedDate = new Date('2024-01-15T10:30:00Z');
    const photos: LocalPhoto[] = [
      {
        id: 'photo-with-caption',
        dataUrl: 'data:image/png;base64,test',
        caption: 'Beautiful sunset',
        addedAt: addedDate,
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Photo with caption</p>',
      mood: 'calm',
      photos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 3,
      encrypted: false,
    });

    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry?.photos[0].caption).toBe('Beautiful sunset');
    expect(savedEntry?.photos[0].addedAt).toEqual(addedDate);
  });

  it('should handle large base64 photo data', async () => {
    // Create a larger base64 string (simulating a real photo)
    const largeBase64 = 'data:image/png;base64,' + 'A'.repeat(10000);
    
    const photos: LocalPhoto[] = [
      {
        id: 'large-photo',
        dataUrl: largeBase64,
        addedAt: new Date(),
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Entry with large photo</p>',
      mood: 'joy',
      photos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 4,
      encrypted: false,
    });

    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry?.photos[0].dataUrl).toHaveLength(largeBase64.length);
  });

  it('should maintain photo order', async () => {
    const photos: LocalPhoto[] = [
      {
        id: 'first',
        dataUrl: 'data:image/png;base64,1',
        addedAt: new Date('2024-01-01'),
      },
      {
        id: 'second',
        dataUrl: 'data:image/png;base64,2',
        addedAt: new Date('2024-01-02'),
      },
      {
        id: 'third',
        dataUrl: 'data:image/png;base64,3',
        addedAt: new Date('2024-01-03'),
      },
    ];

    const entryId = await entryRepository.create({
      userId: testUserId,
      content: '<p>Ordered photos</p>',
      mood: 'reflective',
      photos,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 2,
      encrypted: false,
    });

    const savedEntry = await entryRepository.read(entryId);
    expect(savedEntry?.photos[0].id).toBe('first');
    expect(savedEntry?.photos[1].id).toBe('second');
    expect(savedEntry?.photos[2].id).toBe('third');
  });
});
