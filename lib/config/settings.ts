import { MetadataSync } from '../sync';

export interface UserSettings {
  theme: 'pastel' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  encryption: boolean;
  encryptionPassword?: string;
}

export class SettingsService {
  private sync = new MetadataSync();
  private defaultSettings: UserSettings = {
    theme: 'pastel',
    fontSize: 'medium',
    animations: true,
    encryption: false
  };

  getSettings(): UserSettings {
    const saved = localStorage.getItem('userSettings');
    return saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : this.defaultSettings;
  }

  async updateSettings(userId: string, updates: Partial<UserSettings>) {
    const current = this.getSettings();
    const newSettings = { ...current, ...updates };
    
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    
    // Apply settings immediately for instant visual feedback
    this.applySettings(newSettings);
    
    if (userId && !userId.startsWith('guest_')) {
      const { encryptionPassword, ...syncableSettings } = newSettings;
      await this.sync.syncPreferences(userId, syncableSettings);
    }
    
    return newSettings;
  }

  applySettings(settings: UserSettings) {
    const root = document.documentElement;
    
    // Apply theme by setting data attribute (CSS handles the rest)
    root.setAttribute('data-theme', settings.theme);
    
    // Apply font size
    const fontSizes = { small: '14px', medium: '16px', large: '20px' };
    root.style.fontSize = fontSizes[settings.fontSize];
    
    // Apply font size classes to body
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.add(`font-size-${settings.fontSize}`);
    
    // Set body background to match theme
    document.body.style.backgroundColor = 'var(--peaceful-bg)';
    document.body.style.color = 'var(--peaceful-text)';
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-animations', settings.animations.toString());
    
    // Force repaint to ensure theme changes are applied immediately
    document.body.offsetHeight;
  }

  async eraseAllData() {
    if (confirm('This will permanently delete all your journal entries and data. This cannot be undone. Are you sure?')) {
      localStorage.clear();
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(databases.map(db => {
          if (db.name) {
            const deleteReq = indexedDB.deleteDatabase(db.name);
            return new Promise((resolve, reject) => {
              deleteReq.onsuccess = () => resolve(void 0);
              deleteReq.onerror = () => reject(deleteReq.error);
            });
          }
        }));
      }
      window.location.reload();
    }
  }
}