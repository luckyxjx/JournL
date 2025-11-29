import { LeafIcon, SunsetIcon, WaveIcon, HeartIcon, AcornIcon, MonochromeIcon } from '@/components/ThemeIcons';

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  preview: {
    gradient: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  };
}

export const themes: Theme[] = [
  {
    id: 'peaceful-green',
    name: 'Peaceful Green',
    description: 'Calm and serene nature vibes',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#064E3B',
      textSecondary: '#065F46',
    },
    preview: {
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      icon: LeafIcon,
    },
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    description: 'Cozy evening warmth',
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FBBF24',
      background: '#FFFBEB',
      surface: '#FEF3C7',
      text: '#92400E',
      textSecondary: '#B45309',
    },
    preview: {
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      icon: SunsetIcon,
    },
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Deep and tranquil waters',
    colors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      accent: '#60A5FA',
      background: '#EFF6FF',
      surface: '#DBEAFE',
      text: '#1E3A8A',
      textSecondary: '#1D4ED8',
    },
    preview: {
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
      icon: WaveIcon,
    },
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    description: 'Soft and dreamy purple',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      background: '#FAF5FF',
      surface: '#EDE9FE',
      text: '#581C87',
      textSecondary: '#6B21A8',
    },
    preview: {
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      icon: HeartIcon,
    },
  },
  {
    id: 'earthy-brown',
    name: 'Earthy Brown',
    description: 'Grounded and natural',
    colors: {
      primary: '#A16207',
      secondary: '#92400E',
      accent: '#D97706',
      background: '#FFFBEB',
      surface: '#FED7AA',
      text: '#451A03',
      textSecondary: '#78350F',
    },
    preview: {
      gradient: 'linear-gradient(135deg, #A16207 0%, #D97706 100%)',
      icon: AcornIcon,
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean and minimal',
    colors: {
      primary: '#374151',
      secondary: '#4B5563',
      accent: '#6B7280',
      background: '#F9FAFB',
      surface: '#F3F4F6',
      text: '#111827',
      textSecondary: '#6B7280',
    },
    preview: {
      gradient: 'linear-gradient(135deg, #374151 0%, #6B7280 100%)',
      icon: MonochromeIcon,
    },
  },
];

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0];
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
  
  // Force update of peaceful variables
  root.style.setProperty('--peaceful-bg', theme.colors.background);
  root.style.setProperty('--peaceful-card', theme.colors.surface);
  root.style.setProperty('--peaceful-warm', theme.colors.surface);
  root.style.setProperty('--peaceful-button', theme.colors.secondary);
  root.style.setProperty('--peaceful-accent', theme.colors.primary);
  root.style.setProperty('--peaceful-text', theme.colors.text);
  root.style.setProperty('--peaceful-text-secondary', theme.colors.textSecondary);
};