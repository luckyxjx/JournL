import { EncryptionService } from '../services/storage/encryption.service';
import { JournalEntry } from './db';

export class SecureStorage {
  private encryption = new EncryptionService();
  private readonly STORAGE_KEY = 'journal_encryption_enabled';

  isEncryptionEnabled(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  enableEncryption() {
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  async encryptEntry(entry: JournalEntry, password: string): Promise<JournalEntry> {
    if (!this.isEncryptionEnabled()) return entry;
    
    return {
      ...entry,
      content: await this.encryption.encrypt(entry.content, password),
      encrypted: true
    };
  }

  async decryptEntry(entry: JournalEntry, password: string): Promise<JournalEntry> {
    if (!entry.encrypted) return entry;
    
    return {
      ...entry,
      content: await this.encryption.decrypt(entry.content, password),
      encrypted: false
    };
  }
}