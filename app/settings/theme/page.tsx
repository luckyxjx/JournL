'use client';

import { motion } from 'framer-motion';
import { themes, Theme } from '@/lib/themes';
import { useTheme } from '@/hooks/useTheme';

export default function ThemePage() {
  const { currentTheme, changeTheme } = useTheme();

  const handleThemeSelect = (theme: Theme) => {
    changeTheme(theme.id);
  };

  return (
    <div className="min-h-screen bg-peaceful-bg p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">Choose Your Theme</h1>
          <p className="text-peaceful-text/70">Select a theme that matches your mood and style</p>
        </div>
        
        {/* FAB Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="fixed top-6 left-6 z-50 w-14 h-14 bg-peaceful-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer group ${
                currentTheme.id === theme.id ? 'ring-2 ring-peaceful-accent' : ''
              }`}
              onClick={() => handleThemeSelect(theme)}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Theme Preview */}
                <div 
                  className="w-full h-32 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: theme.preview.gradient }}
                >
                  <theme.preview.icon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>

                {/* Theme Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900">{theme.name}</h3>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>

                {/* Color Palette */}
                <div className="flex gap-2 mt-4">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                </div>

                {/* Selected Indicator */}
                {currentTheme.id === theme.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-peaceful-accent rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 text-center">
          <div className="bg-peaceful-warm/50 rounded-2xl p-8 border border-peaceful/20">
            <h3 className="text-xl font-semibold text-peaceful-text mb-2">More Themes Coming Soon</h3>
            <p className="text-peaceful-text/70">We're working on more beautiful themes to personalize your journaling experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}