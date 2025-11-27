'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { ExportService, ImportService } from '@/lib/export';
import { SettingsService, UserSettings } from '@/lib/settings';
import { AuthFlows } from '@/lib/auth-flows';
import AuthGuard from '@/components/AuthGuard';
import { ThemeIcon, FontSizeIcon, AnimationIcon, ExportIcon, ImportIcon, LogoutIcon, TrashIcon } from '@/components/icons/SettingsIcons';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'pastel',
    fontSize: 'medium',
    animations: true,
    encryption: false
  });
  const [loading, setLoading] = useState('');
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  
  const settingsService = new SettingsService();
  const exportService = new ExportService();
  const importService = new ImportService();
  const authFlows = new AuthFlows();

  useEffect(() => {
    const loadedSettings = settingsService.getSettings();
    setSettings(loadedSettings);
    settingsService.applySettings(loadedSettings);
  }, []);
  
  const updateSetting = async (key: string, value: any) => {
    setLoading(key);
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Apply settings immediately
      settingsService.applySettings(newSettings);
      
      await settingsService.updateSettings(user?.id || '', { [key]: value });
      setShowSuccess(`${key} updated successfully`);
      setTimeout(() => setShowSuccess(''), 2000);
    } catch (error) {
      console.error('Failed to update setting:', error);
    } finally {
      setLoading('');
    }
  };

  const handleLogout = async (keepLocal: boolean) => {
    setLoading('logout');
    try {
      await authFlows.signOut(!keepLocal);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading('');
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    setLoading(`export-${format}`);
    try {
      if (format === 'json') {
        const data = await exportService.exportToJSON(user?.id || '');
        exportService.downloadFile(data, `journal-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
      } else {
        const data = await exportService.exportToCSV(user?.id || '');
        exportService.downloadFile(data, `journal-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
      }
      setShowSuccess(`${format.toUpperCase()} exported successfully`);
      setTimeout(() => setShowSuccess(''), 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading('');
    }
  };

  const handleImport = async (file: File) => {
    setLoading('import');
    try {
      const text = await file.text();
      const imported = await importService.importFromJSON(text, user?.id || '');
      setShowSuccess(`Imported ${imported} entries successfully`);
      setTimeout(() => setShowSuccess(''), 3000);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setLoading('');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-peaceful-bg p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()} 
              className="text-peaceful-text hover:text-peaceful-accent transition-colors p-2 rounded-lg hover:bg-white/20"
            >
              ← Back
            </motion.button>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-peaceful-text">Settings</h1>
          </motion.div>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl text-sm"
            >
              ✓ {showSuccess}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-4 md:p-6 shadow-glass"
          >
            <div className="flex items-center gap-3 mb-4">
              <ThemeIcon className="w-5 h-5 text-peaceful-accent" />
              <h2 className="text-xl font-serif font-semibold text-peaceful-text">Theme</h2>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {(['pastel', 'dark'] as const).map((t, index) => (
                <motion.button
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateSetting('theme', t)}
                  disabled={loading === 'theme'}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl capitalize font-medium transition-all duration-200 text-sm md:text-base ${
                    settings.theme === t 
                      ? 'bg-peaceful-accent text-peaceful-bg shadow-md' 
                      : 'bg-peaceful-card text-peaceful-text hover:bg-peaceful-hover border border-peaceful'
                  } ${loading === 'theme' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === 'theme' && settings.theme === t ? '...' : t}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-4 md:p-6 shadow-glass"
          >
            <div className="flex items-center gap-3 mb-4">
              <FontSizeIcon className="w-5 h-5 text-peaceful-accent" />
              <h2 className="text-xl font-serif font-semibold text-peaceful-text">Font Size</h2>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {(['small', 'medium', 'large'] as const).map((size, index) => (
                <motion.button
                  key={size}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateSetting('fontSize', size)}
                  disabled={loading === 'fontSize'}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl capitalize font-medium transition-all duration-200 text-sm md:text-base ${
                    settings.fontSize === size 
                      ? 'bg-peaceful-button text-peaceful-bg shadow-md' 
                      : 'bg-peaceful-card text-peaceful-text hover:bg-peaceful-hover border border-peaceful'
                  } ${loading === 'fontSize' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === 'fontSize' && settings.fontSize === size ? '...' : size}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-4 md:p-6 shadow-glass"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <AnimationIcon className="w-5 h-5 text-peaceful-accent" />
                <div>
                  <span className="text-peaceful-text font-medium">Animations</span>
                  <p className="text-sm text-peaceful-secondary">Enable smooth transitions and effects</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('animations', !settings.animations)}
                disabled={loading === 'animations'}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.animations ? 'bg-peaceful-button' : 'bg-peaceful-card border-2 border-peaceful'
                } ${loading === 'animations' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div 
                  className={`w-4 h-4 bg-peaceful-bg rounded-full shadow-sm absolute top-1 transition-transform duration-200 ${
                    settings.animations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-4 md:p-6 shadow-glass space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <ExportIcon className="w-5 h-5 text-peaceful-accent" />
              <h2 className="text-xl font-serif font-semibold text-peaceful-text">Data Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('json')}
                disabled={loading === 'export-json'}
                className="bg-peaceful-button text-peaceful-bg py-3 px-4 rounded-xl hover:bg-peaceful-accent transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === 'export-json' ? (
                  <div className="w-4 h-4 border-2 border-peaceful-bg/30 border-t-peaceful-bg rounded-full animate-spin" />
                ) : (
                  <ExportIcon className="w-4 h-4" />
                )}
                Export JSON
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('csv')}
                disabled={loading === 'export-csv'}
                className="bg-peaceful-button text-peaceful-bg py-3 px-4 rounded-xl hover:bg-peaceful-accent transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === 'export-csv' ? (
                  <div className="w-4 h-4 border-2 border-peaceful-bg/30 border-t-peaceful-bg rounded-full animate-spin" />
                ) : (
                  <ExportIcon className="w-4 h-4" />
                )}
                Export CSV
              </motion.button>
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                }}
                disabled={loading === 'import'}
                className="w-full p-3 pl-12 border border-peaceful rounded-xl bg-peaceful-card hover:bg-peaceful-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-peaceful-text"
              />
              <ImportIcon className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-peaceful-accent" />
              {loading === 'import' && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-peaceful-accent/30 border-t-peaceful-accent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEraseConfirm(true)}
              className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              Erase All Local Data
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-4 md:p-6 shadow-glass"
          >
            <div className="flex items-center gap-3 mb-4">
              <LogoutIcon className="w-5 h-5 text-peaceful-accent" />
              <h2 className="text-xl font-serif font-semibold text-peaceful-text">Account</h2>
            </div>
            
            {user && (
              <div className="mb-4 p-3 bg-peaceful-card rounded-lg border border-peaceful">
                <p className="text-sm text-peaceful-secondary">Signed in as:</p>
                <p className="font-medium text-peaceful-text">{user.email || 'Guest User'}</p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLogout(true)}
                disabled={loading === 'logout'}
                className="flex-1 bg-peaceful-button text-white py-3 rounded-xl hover:bg-peaceful-accent transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === 'logout' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogoutIcon className="w-4 h-4" />
                )}
                Keep Data
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLogout(false)}
                disabled={loading === 'logout'}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === 'logout' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <TrashIcon className="w-4 h-4" />
                )}
                Delete Data
              </motion.button>
            </div>
          </motion.div>

          {showEraseConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-bold text-peaceful-text">Erase All Data?</h3>
                </div>
                <p className="text-peaceful-text/70 mb-6">
                  This will permanently delete all your journal entries, photos, and settings. This action cannot be undone.
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEraseConfirm(false)}
                    className="flex-1 bg-gray-200 text-peaceful-text py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      settingsService.eraseAllData();
                      setShowEraseConfirm(false);
                    }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Erase All
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}