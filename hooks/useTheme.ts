'use client';

import { useState, useEffect } from 'react';
import { themes, Theme, applyTheme } from '@/lib/themes';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('journl-theme') || 'peaceful-green';
    const theme = themes.find(t => t.id === savedThemeId) || themes[0];
    setCurrentTheme(theme);
    applyTheme(theme);
  }, []);

  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    setCurrentTheme(theme);
    localStorage.setItem('journl-theme', themeId);
    applyTheme(theme);
  };

  return { currentTheme, changeTheme };
}