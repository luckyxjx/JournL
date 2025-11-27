import { entryRepository } from '@/lib/storage/EntryRepository';
import { JournalEntry } from '@/lib/storage/db';

export class ImportService {
  static async importJSON(file: File): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!data.entries || !Array.isArray(data.entries)) {
      throw new Error('Invalid JSON format');
    }

    for (const entryData of data.entries) {
      const entry: Omit<JournalEntry, 'id'> = {
        userId: entryData.userId,
        content: entryData.content,
        mood: entryData.mood,
        photos: entryData.photos?.map((photo: any) => ({
          ...photo,
          addedAt: new Date(photo.addedAt)
        })) || [],
        createdAt: new Date(entryData.createdAt),
        updatedAt: new Date(entryData.updatedAt),
        wordCount: entryData.wordCount || 0,
        encrypted: entryData.encrypted || false
      };

      // Check for duplicates by createdAt
      const existing = await entryRepository.list();
      const duplicate = existing.find(e => 
        Math.abs(e.createdAt.getTime() - entry.createdAt.getTime()) < 1000
      );

      if (duplicate) {
        // Keep most recent (by updatedAt)
        if (entry.updatedAt > duplicate.updatedAt) {
          await entryRepository.update(duplicate.id, entry);
        }
      } else {
        await entryRepository.create(entry);
      }
    }
  }
}