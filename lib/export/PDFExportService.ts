import jsPDF from 'jspdf';
import { JournalEntry } from '@/lib/storage/db';

export class PDFExportService {
  static async exportEntry(entry: JournalEntry): Promise<void> {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('Journal Entry', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Date: ${entry.createdAt.toLocaleDateString()}`, 20, 50);
    pdf.text(`Mood: ${entry.mood}`, 20, 65);
    
    const textContent = this.stripHtml(entry.content);
    const lines = pdf.splitTextToSize(textContent, 170);
    pdf.text(lines, 20, 85);
    
    pdf.save(`journal-entry-${entry.createdAt.toISOString().split('T')[0]}.pdf`);
  }
  
  private static stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}