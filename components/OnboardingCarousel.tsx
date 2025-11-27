'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingSlide {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    title: 'Welcome to journL',
    description: 'A private, peaceful space for your thoughts and reflections. Your journal entries stay on your device, never in the cloud.',
    icon: WelcomeIcon,
    color: '#10B981',
  },
  {
    title: 'Complete Privacy',
    description: 'All your journal entries, photos, and personal thoughts are stored locally on your device. We never see or access your content.',
    icon: PrivacyIcon,
    color: '#8B5CF6',
  },
  {
    title: 'Track Your Moods',
    description: 'Tag your entries with moods and see beautiful visualizations of your emotional journey over time.',
    icon: MoodIcon,
    color: '#F59E0B',
  },
  {
    title: 'Works Offline',
    description: 'Journal anytime, anywhere. No internet connection required. Your data is always available to you.',
    icon: OfflineIcon,
    color: '#EC4899',
  },
];

interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingCarousel({ onComplete, onSkip }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-peaceful-bg flex items-center justify-center z-50">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-peaceful-warm/90 backdrop-blur-md border border-peaceful rounded-[32px] shadow-glass p-8 md:p-12">
          {/* Skip button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onSkip}
              className="text-peaceful-text/60 hover:text-peaceful-accent transition-colors text-sm font-medium"
            >
              Skip
            </button>
          </div>

          {/* Slide content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center min-h-[300px] flex flex-col items-center justify-center"
            >
              <div className="mb-6 flex justify-center">
                {(() => {
                  const IconComponent = slides[currentSlide].icon;
                  return (
                    <IconComponent 
                      className="w-20 h-20" 
                      style={{ color: slides[currentSlide].color }}
                    />
                  );
                })()}
              </div>
              <h2 className="text-3xl font-bold text-peaceful-text mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-peaceful-text/70 leading-relaxed max-w-lg">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-8 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-peaceful-accent'
                    : 'w-2 bg-peaceful-accent/30 hover:bg-peaceful-accent/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                currentSlide === 0
                  ? 'text-peaceful-text/30 cursor-not-allowed'
                  : 'text-peaceful-text hover:bg-peaceful-accent/10'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-peaceful-accent text-white rounded-full font-medium hover:bg-peaceful-accent/90 transition-all shadow-lg hover:shadow-xl"
            >
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Icon Components for Onboarding
function WelcomeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function PrivacyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function MoodIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function OfflineIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
