import { entryRepository } from '@/lib/storage/EntryRepository';
import { JournalEntry } from '@/lib/storage/db';

export class ExportService {
  static async exportJSON(): Promise<void> {
    const entries = await entryRepository.list();
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      entries: entries.map(entry => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
        photos: entry.photos.map(photo => ({
          ...photo,
          addedAt: photo.addedAt.toISOString()
        }))
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async exportCSV(): Promise<void> {
    const entries = await entryRepository.list();
    const csvContent = [
      'Date,Mood,Content,Word Count',
      ...entries.map(entry => {
        const content = this.stripHtml(entry.content).replace(/"/g, '""');
        return `"${entry.createdAt.toLocaleDateString()}","${entry.mood}","${content}",${entry.wordCount}`;
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private static stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}