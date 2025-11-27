'use client';

import { useState, useEffect } from 'react';
import { themes, Theme, applyTheme } from '@/lib/themes';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionData, setTransitionData] = useState<{
    themeId: string;
    clickPosition: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const savedThemeId = localStorage.getItem('journl-theme') || 'peaceful-green';
    const theme = themes.find(t => t.id === savedThemeId) || themes[0];
    setCurrentTheme(theme);
    applyTheme(theme);
  }, []);

  const changeTheme = (themeId: string, clickPosition?: { x: number; y: number }) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    
    // Reset any existing transition first
    setIsTransitioning(false);
    setTransitionData(null);
    
    // Start transition effect if click position provided and theme has animation
    if (clickPosition && ['ocean-blue', 'lavender-dreams', 'warm-sunset', 'earthy-brown', 'peaceful-green'].includes(themeId)) {
      // Small delay to ensure state reset
      setTimeout(() => {
        setIsTransitioning(true);
        setTransitionData({ themeId, clickPosition });
      }, 50);
      
      // Apply theme after different delays based on animation
      const delay = themeId === 'earthy-brown' ? 800 : 300;
      setTimeout(() => {
        setCurrentTheme(theme);
        localStorage.setItem('journl-theme', themeId);
        applyTheme(theme);
      }, delay);
    } else {
      // Immediate theme change for other themes
      setCurrentTheme(theme);
      localStorage.setItem('journl-theme', themeId);
      applyTheme(theme);
    }
  };

  const completeTransition = () => {
    setIsTransitioning(false);
    setTransitionData(null);
  };

  return { 
    currentTheme, 
    changeTheme, 
    isTransitioning, 
    transitionData, 
    completeTransition 
  };
}