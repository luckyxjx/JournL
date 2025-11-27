import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'pastel';
export type FontSize = 'small' | 'medium' | 'large';

interface SettingsState {
  theme: Theme;
  fontSize: FontSize;
  animationsEnabled: boolean;
  encryptionEnabled: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setEncryptionEnabled: (enabled: boolean) => void;
  eraseAllData: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'pastel',
      fontSize: 'medium',
      animationsEnabled: true,
      encryptionEnabled: false,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setEncryptionEnabled: (encryptionEnabled) => set({ encryptionEnabled }),
      eraseAllData: async () => {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return new Promise<void>((resolve, reject) => {
                const deleteReq = indexedDB.deleteDatabase(db.name!);
                deleteReq.onsuccess = () => resolve();
                deleteReq.onerror = () => reject();
              });
            }
          })
        );
        localStorage.clear();
        window.location.reload();
      },
    }),
    {
      name: 'calm-journal-settings',
    }
  )
);