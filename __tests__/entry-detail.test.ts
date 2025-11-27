/**
 * Entry Detail and Management Tests
 * 
 * Tests for Requirement 3.1, 3.2, 3.4:
 * - Entry detail page displays full content, mood, timestamps, photos
 * - Edit functionality preserves createdAt timestamp
 * - Continue writing appends content and updates timestamp
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { db, JournalEntry } from '@/lib/storage/db';

describe('Entry Detail and Management', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.entries.clear();
  });

  afterEach(async () => {
    // Clean up after each test
    await db.entries.clear();
  });

  it('should display entry with all components (Requirement 3.1)', async () => {
    // Create a test entry with all fields
    const testEntry: Omit<JournalEntry, 'id'> = {
      userId: 'test-user',
      content: '<p>This is my journal entry with <strong>bold text</strong>.</p>',
      mood: 'joy',
      photos: [
        {
          id: 'photo-1',
          dataUrl: 'data:image/png;base64,test',
          caption: 'Test photo',
          addedAt: new Date(),
        },
      ],
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
      wordCount: 8,
      encrypted: false,
    };

    const entryId = await entryRepository.create(testEntry);

    // Retrieve the entry
    const retrievedEntry = await entryRepository.read(entryId);

    // Verify all components are present
    expect(retrievedEntry).toBeDefined();
    expect(retrievedEntry?.content).toBe(testEntry.content);
    expect(retrievedEntry?.mood).toBe(testEntry.mood);
    expect(retrievedEntry?.createdAt).toEqual(testEntry.createdAt);
    expect(retrievedEntry?.updatedAt).toEqual(testEntry.updatedAt);
    expect(retrievedEntry?.photos).toHaveLength(1);
    expect(retrievedEntry?.photos[0].dataUrl).toBe('data:image/png;base64,test');
  });

  it('should preserve createdAt when editing entry (Requirement 3.2)', async () => {
    // Create initial entry
    const originalCreatedAt = new Date('2024-01-15T10:00:00Z');
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Original content</p>',
      mood: 'calm',
      photos: [],
      createdAt: originalCreatedAt,
      updatedAt: originalCreatedAt,
      wordCount: 2,
      encrypted: false,
    });

    // Wait a bit to ensure timestamps are different
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Edit the entry
    const newUpdatedAt = new Date();
    await entryRepository.update(entryId, {
      content: '<p>Updated content</p>',
      updatedAt: newUpdatedAt,
      wordCount: 2,
    });

    // Retrieve and verify
    const updatedEntry = await entryRepository.read(entryId);

    expect(updatedEntry).toBeDefined();
    expect(updatedEntry?.createdAt).toEqual(originalCreatedAt); // Should be preserved
    expect(updatedEntry?.updatedAt.getTime()).toBeGreaterThan(originalCreatedAt.getTime()); // Should be updated
    expect(updatedEntry?.content).toBe('<p>Updated content</p>');
  });

  it('should append content when continuing writing (Requirement 3.4)', async () => {
    // Create initial entry
    const originalContent = '<p>Day 1: Started my journal.</p>';
    const createdAt = new Date('2024-01-15T10:00:00Z');
    
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: originalContent,
      mood: 'reflective',
      photos: [],
      createdAt,
      updatedAt: createdAt,
      wordCount: 5,
      encrypted: false,
    });

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Continue writing (append new content)
    const appendedContent = '<p>Day 1 continued: Had a great day!</p>';
    const newUpdatedAt = new Date();
    
    await entryRepository.update(entryId, {
      content: originalContent + appendedContent,
      updatedAt: newUpdatedAt,
      wordCount: 11,
    });

    // Retrieve and verify
    const updatedEntry = await entryRepository.read(entryId);

    expect(updatedEntry).toBeDefined();
    expect(updatedEntry?.content).toBe(originalContent + appendedContent);
    expect(updatedEntry?.createdAt).toEqual(createdAt); // Preserved
    expect(updatedEntry?.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime()); // Updated
  });

  it('should delete entry and remove from storage (Requirement 3.3)', async () => {
    // Create entry
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Entry to be deleted</p>',
      mood: 'sad',
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 4,
      encrypted: false,
    });

    // Verify entry exists
    let entry = await entryRepository.read(entryId);
    expect(entry).toBeDefined();

    // Delete entry
    await entryRepository.delete(entryId);

    // Verify entry is gone
    entry = await entryRepository.read(entryId);
    expect(entry).toBeNull();
  });

  it('should handle multiple edits while preserving createdAt', async () => {
    const originalCreatedAt = new Date('2024-01-15T10:00:00Z');
    
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Version 1</p>',
      mood: 'joy',
      photos: [],
      createdAt: originalCreatedAt,
      updatedAt: originalCreatedAt,
      wordCount: 2,
      encrypted: false,
    });

    // First edit
    await new Promise((resolve) => setTimeout(resolve, 10));
    await entryRepository.update(entryId, {
      content: '<p>Version 2</p>',
      updatedAt: new Date(),
    });

    // Second edit
    await new Promise((resolve) => setTimeout(resolve, 10));
    await entryRepository.update(entryId, {
      content: '<p>Version 3</p>',
      updatedAt: new Date(),
    });

    // Verify
    const finalEntry = await entryRepository.read(entryId);
    expect(finalEntry?.createdAt).toEqual(originalCreatedAt);
    expect(finalEntry?.content).toBe('<p>Version 3</p>');
  });

  it('should update mood when editing entry', async () => {
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Feeling calm today</p>',
      mood: 'calm',
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 3,
      encrypted: false,
    });

    // Change mood
    await entryRepository.update(entryId, {
      mood: 'joy',
      updatedAt: new Date(),
    });

    const updatedEntry = await entryRepository.read(entryId);
    expect(updatedEntry?.mood).toBe('joy');
  });

  it('should handle photos when editing entry', async () => {
    const entryId = await entryRepository.create({
      userId: 'test-user',
      content: '<p>Entry with photos</p>',
      mood: 'joy',
      photos: [
        {
          id: 'photo-1',
          dataUrl: 'data:image/png;base64,original',
          addedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 3,
      encrypted: false,
    });

    // Add another photo
    await entryRepository.update(entryId, {
      photos: [
        {
          id: 'photo-1',
          dataUrl: 'data:image/png;base64,original',
          addedAt: new Date(),
        },
        {
          id: 'photo-2',
          dataUrl: 'data:image/png;base64,new',
          addedAt: new Date(),
        },
      ],
      updatedAt: new Date(),
    });

    const updatedEntry = await entryRepository.read(entryId);
    expect(updatedEntry?.photos).toHaveLength(2);
  });
});
