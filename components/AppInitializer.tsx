'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';
import OnboardingCarousel from './OnboardingCarousel';
import { hasCompletedOnboarding, setOnboardingCompleted } from '@/lib/onboarding';
import { SettingsService } from '@/lib/settings';

type InitializationState = 'splash' | 'onboarding' | 'ready';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [state, setState] = useState<InitializationState>('splash');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize theme settings on app load
    if (typeof window !== 'undefined') {
      const settingsService = new SettingsService();
      const settings = settingsService.getSettings();
      settingsService.applySettings(settings);
    }
  }, []);

  const handleSplashComplete = () => {
    // Check if user has completed onboarding
    if (hasCompletedOnboarding()) {
      setState('ready');
    } else {
      setState('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setOnboardingCompleted();
    setState('ready');
  };

  const handleOnboardingSkip = () => {
    setOnboardingCompleted();
    setState('ready');
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-mint-green to-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-forest-green mb-4">
            Calm Journal
          </h1>
          <p className="text-xl text-forest-green/70">
            Your private space for reflection
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {state === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {state === 'onboarding' && (
        <OnboardingCarousel
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {state === 'ready' && children}
    </>
  );
}
