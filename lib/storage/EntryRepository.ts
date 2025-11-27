import { db, JournalEntry, MoodTag } from './db';

export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  moodFilter?: MoodTag[];
}

export interface IEntryRepository {
  create(entry: Omit<JournalEntry, 'id'>): Promise<string>;
  read(id: string): Promise<JournalEntry | null>;
  update(id: string, updates: Partial<JournalEntry>): Promise<void>;
  delete(id: string): Promise<void>;
  list(options?: ListOptions): Promise<JournalEntry[]>;
  search(query: string): Promise<JournalEntry[]>;
}

export class EntryRepository implements IEntryRepository {
  /**
   * Create a new journal entry
   * @param entry - Entry data without ID
   * @returns The generated entry ID
   */
  async create(entry: Omit<JournalEntry, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    const newEntry: JournalEntry = {
      id,
      ...entry,
    };
    
    await db.entries.add(newEntry);
    return id;
  }

  /**
   * Read a journal entry by ID
   * @param id - Entry ID
   * @returns The entry or null if not found
   */
  async read(id: string): Promise<JournalEntry | null> {
    const entry = await db.entries.get(id);
    return entry || null;
  }

  /**
   * Update an existing journal entry
   * @param id - Entry ID
   * @param updates - Partial entry data to update
   */
  async update(id: string, updates: Partial<JournalEntry>): Promise<void> {
    const existing = await db.entries.get(id);
    if (!existing) {
      throw new Error(`Entry with id ${id} not found`);
    }

    await db.entries.update(id, updates);
  }

  /**
   * Delete a journal entry
   * @param id - Entry ID
   */
  async delete(id: string): Promise<void> {
    await db.entries.delete(id);
  }

  /**
   * List journal entries with optional filtering and sorting
   * @param options - List options
   * @returns Array of entries
   */
  async list(options: ListOptions = {}): Promise<JournalEntry[]> {
    const {
      limit,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      moodFilter,
    } = options;

    let collection = db.entries.toCollection();

    // Apply mood filter if provided
    if (moodFilter && moodFilter.length > 0) {
      collection = db.entries.where('mood').anyOf(moodFilter);
    }

    // Apply sorting
    let entries = await collection.toArray();
    entries.sort((a, b) => {
      const aValue = a[sortBy].getTime();
      const bValue = b[sortBy].getTime();
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    // Apply pagination
    if (limit !== undefined) {
      entries = entries.slice(offset, offset + limit);
    } else if (offset > 0) {
      entries = entries.slice(offset);
    }

    return entries;
  }

  /**
   * Search journal entries by content
   * @param query - Search query string
   * @returns Array of matching entries
   */
  async search(query: string): Promise<JournalEntry[]> {
    const lowerQuery = query.toLowerCase();
    
    const allEntries = await db.entries.toArray();
    
    return allEntries.filter(entry => 
      entry.content.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export singleton instance
export const entryRepository = new EntryRepository();
