'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingSlide {
  title: string;
  description: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    title: 'Welcome to Calm Journal',
    description: 'A private, peaceful space for your thoughts and reflections. Your journal entries stay on your device, never in the cloud.',
    icon: '🌸',
  },
  {
    title: 'Complete Privacy',
    description: 'All your journal entries, photos, and personal thoughts are stored locally on your device. We never see or access your content.',
    icon: '🔒',
  },
  {
    title: 'Track Your Moods',
    description: 'Tag your entries with moods and see beautiful visualizations of your emotional journey over time.',
    icon: '💭',
  },
  {
    title: 'Works Offline',
    description: 'Journal anytime, anywhere. No internet connection required. Your data is always available to you.',
    icon: '✨',
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
    <div className="fixed inset-0 bg-gradient-to-br from-mint-green via-sage-green to-cream flex items-center justify-center z-50">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-[32px] shadow-2xl p-8 md:p-12">
          {/* Skip button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onSkip}
              className="text-forest-green/60 hover:text-forest-green transition-colors text-sm font-medium"
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
              <div className="text-7xl mb-6">{slides[currentSlide].icon}</div>
              <h2 className="text-3xl font-bold text-forest-green mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-forest-green/70 leading-relaxed max-w-lg">
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
                    ? 'w-8 bg-forest-green'
                    : 'w-2 bg-forest-green/30 hover:bg-forest-green/50'
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
                  ? 'text-forest-green/30 cursor-not-allowed'
                  : 'text-forest-green hover:bg-forest-green/10'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-forest-green text-white rounded-full font-medium hover:bg-forest-green/90 transition-all shadow-lg hover:shadow-xl"
            >
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
