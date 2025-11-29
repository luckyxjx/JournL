'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SettingsService } from '@/lib/config/settings';
import { useAuth } from '@/lib/auth';

export default function PrivacyPage() {
  const { user, isGuest } = useAuth();
  const [settings, setSettings] = useState(() => new SettingsService().getSettings());
  const settingsService = new SettingsService();

  const handleEncryptionToggle = async () => {
    const userId = user?.id || (isGuest ? 'guest' : 'anonymous');
    const newSettings = await settingsService.updateSettings(userId, {
      encryption: !settings.encryption
    });
    setSettings(newSettings);
  };

  const handleEraseData = async () => {
    await settingsService.eraseAllData();
  };

  return (
    <div className="min-h-screen bg-peaceful-bg p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">Privacy Settings</h1>
          <p className="text-peaceful-text/70">Manage your data and privacy preferences</p>
        </div>
        
        <button 
          onClick={() => window.history.back()}
          className="fixed top-6 left-6 z-50 w-14 h-14 bg-peaceful-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-peaceful-warm/90 backdrop-blur-md border border-peaceful rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-peaceful-text mb-4">Data Encryption</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-peaceful-text">Encrypt journal entries</p>
                <p className="text-sm text-peaceful-text/70">Adds an extra layer of security to your entries</p>
              </div>
              <button
                onClick={handleEncryptionToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.encryption ? 'bg-peaceful-accent' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.encryption ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-peaceful-warm/90 backdrop-blur-md border border-peaceful rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-peaceful-text mb-4">Data Storage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-peaceful-text">Local Storage</span>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-sm text-peaceful-text/70">
                Your journal entries are stored locally on your device for maximum privacy
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-red-800 mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div>
                <p className="text-red-700 mb-2">Erase All Data</p>
                <p className="text-sm text-red-600 mb-4">
                  This will permanently delete all your journal entries and cannot be undone
                </p>
                <button
                  onClick={handleEraseData}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Erase All Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}