'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    // Apply theme on mount and when theme changes
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });
  }, [currentTheme]);

  return <>{children}</>;
}