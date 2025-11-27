import { EntryRepository } from './storage/EntryRepository';

export class ExportService {
  private entryRepo = new EntryRepository();

  async exportToJSON(userId: string): Promise<string> {
    const entries = await this.entryRepo.list();
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      entries: entries.map(entry => ({
        id: entry.id,
        content: entry.content,
        mood: entry.mood,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
        photos: entry.photos || []
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  async exportToCSV(userId: string): Promise<string> {
    const entries = await this.entryRepo.list();
    const headers = 'Date,Mood,Content,Photos\n';
    const rows = entries.map(entry => {
      const date = entry.createdAt.toISOString().split('T')[0];
      const content = `"${entry.content.replace(/"/g, '""')}"`;
      const photos = entry.photos?.length || 0;
      return `${date},${entry.mood},${content},${photos}`;
    }).join('\n');
    return headers + rows;
  }

  downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export class ImportService {
  private entryRepo = new EntryRepository();

  async importFromJSON(jsonData: string, userId: string): Promise<number> {
    try {
      const data = JSON.parse(jsonData);
      let imported = 0;
      
      for (const entryData of data.entries) {
        const existing = await this.entryRepo.read(entryData.id);
        if (!existing || new Date(entryData.updatedAt) > existing.updatedAt) {
          await this.entryRepo.create({
            userId,
            content: entryData.content,
            mood: entryData.mood,
            createdAt: new Date(entryData.createdAt),
            updatedAt: new Date(entryData.updatedAt),
            photos: entryData.photos,
            wordCount: entryData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter((w: string) => w.length > 0).length,
            encrypted: false
          });
          imported++;
        }
      }
      return imported;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }
}