'use client';

import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-mint-green to-cream flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        // Wait a moment before completing
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-6xl font-bold text-forest-green mb-4">
          Calm Journal
        </h1>
        <p className="text-xl text-forest-green/70">
          Your private space for reflection
        </p>
      </motion.div>
    </motion.div>
  );
}
