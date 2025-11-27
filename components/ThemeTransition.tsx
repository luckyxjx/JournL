'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeTransitionProps {
  isActive: boolean;
  themeId: string;
  clickPosition: { x: number; y: number };
  onComplete: () => void;
}

export default function ThemeTransition({ isActive, themeId, clickPosition, onComplete }: ThemeTransitionProps) {
  const [waves, setWaves] = useState<number[]>([]);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  useEffect(() => {
    if (!isActive) return;

    let startTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    if (themeId === 'ocean-blue') {
      setWaves([]);
      startTimer = setTimeout(() => setWaves([1, 2, 3]), 10);
      completeTimer = setTimeout(() => {
        setWaves([]);
        onComplete();
      }, 2000);
    }
    
    else if (themeId === 'lavender-dreams') {
      // Create falling petals
      const petals = Array.from({length: 15}, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50
      }));
      setParticles(petals);
      completeTimer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 2500);
    }
    
    else if (themeId === 'warm-sunset') {
      completeTimer = setTimeout(onComplete, 1800);
    }
    
    else if (themeId === 'earthy-brown') {
      completeTimer = setTimeout(onComplete, 2200);
    }
    
    else if (themeId === 'peaceful-green') {
      const leaves = Array.from({length: 12}, (_, i) => ({
        id: i,
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight - 100) + 50
      }));
      setParticles(leaves);
      completeTimer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 3000);
    }

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, themeId, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {/* Ocean Blue Waves */}
        {themeId === 'ocean-blue' && (
          <>
            {/* Water droplet */}
            <motion.div
              key="ocean-droplet"
              className="absolute bg-blue-400/40 rounded-full"
              style={{
                left: clickPosition.x - 15,
                top: clickPosition.y - 15,
                width: 30,
                height: 30,
              }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 20, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            {waves.map((wave, index) => (
              <motion.div
                key={`ocean-wave-${wave}-${index}`}
                className="absolute rounded-full border-2 border-blue-300/30"
                style={{
                  left: clickPosition.x - 25,
                  top: clickPosition.y - 25,
                  width: 50,
                  height: 50,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 40, opacity: 0 }}
                transition={{ duration: 2, delay: index * 0.3, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        
        {/* Lavender Dreams */}
        {themeId === 'lavender-dreams' && (
          <>
            {/* Center heart icon */}
            <motion.div
              key="lavender-center"
              className="absolute flex items-center justify-center"
              style={{
                left: clickPosition.x - 20,
                top: clickPosition.y - 20,
                width: 40,
                height: 40
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.5 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-purple-400">
                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </motion.div>
            {/* Ripple waves */}
            {[1, 2, 3].map((wave, index) => (
              <motion.div
                key={`lavender-wave-${wave}`}
                className="absolute rounded-full border-2 border-purple-300/30"
                style={{
                  left: clickPosition.x - 25,
                  top: clickPosition.y - 25,
                  width: 50,
                  height: 50,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 40, opacity: 0 }}
                transition={{ duration: 2.5, delay: index * 0.3, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        
        {/* Warm Sunset */}
        {themeId === 'warm-sunset' && (
          <>
            {/* Center star icon */}
            <motion.div
              key="sunset-center"
              className="absolute flex items-center justify-center"
              style={{
                left: clickPosition.x - 20,
                top: clickPosition.y - 20,
                width: 40,
                height: 40
              }}
              initial={{ scale: 1, opacity: 1, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400">
                <path fill="currentColor" d="M12 1L15.09 8.26L22 9L17 14.74L18.18 21.02L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 1Z"/>
              </svg>
            </motion.div>
            {/* Ripple waves */}
            {[1, 2, 3].map((wave, index) => (
              <motion.div
                key={`sunset-wave-${wave}`}
                className="absolute rounded-full border-2 border-orange-300/30"
                style={{
                  left: clickPosition.x - 25,
                  top: clickPosition.y - 25,
                  width: 50,
                  height: 50,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 35, opacity: 0 }}
                transition={{ duration: 2.2, delay: index * 0.3, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        
        {/* Earthy Brown */}
        {themeId === 'earthy-brown' && (
          <>
            {/* Center tree icon */}
            <motion.div
              key="earthy-center"
              className="absolute flex items-center justify-center"
              style={{
                left: clickPosition.x - 20,
                top: clickPosition.y - 20,
                width: 40,
                height: 40
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.5 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-amber-600">
                <path fill="currentColor" d="M11,21V16.74C10.53,16.91 10.03,17 9.5,17C7,17 5,15 5,12.5C5,11.23 5.5,10.09 6.36,9.27C6.13,8.73 6,8.13 6,7.5C6,4.46 8.46,2 11.5,2S17,4.46 17,7.5C17,8.13 16.87,8.73 16.64,9.27C17.5,10.09 18,11.23 18,12.5C18,15 16,17 13.5,17C12.97,17 12.47,16.91 12,16.74V21H11Z"/>
              </svg>
            </motion.div>
            {/* Ripple waves */}
            {[1, 2, 3].map((wave, index) => (
              <motion.div
                key={`earthy-wave-${wave}`}
                className="absolute rounded-full border-2 border-amber-500/30"
                style={{
                  left: clickPosition.x - 25,
                  top: clickPosition.y - 25,
                  width: 50,
                  height: 50,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 38, opacity: 0 }}
                transition={{ duration: 2.5, delay: index * 0.3, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        
        {/* Peaceful Green */}
        {themeId === 'peaceful-green' && (
          <>
            {/* Center leaf icon */}
            <motion.div
              key="green-center"
              className="absolute flex items-center justify-center"
              style={{
                left: clickPosition.x - 20,
                top: clickPosition.y - 20,
                width: 40,
                height: 40
              }}
              initial={{ scale: 1, opacity: 1, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-green-400">
                <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
              </svg>
            </motion.div>
            {/* Ripple waves */}
            {[1, 2, 3].map((wave, index) => (
              <motion.div
                key={`green-wave-${wave}`}
                className="absolute rounded-full border-2 border-green-300/30"
                style={{
                  left: clickPosition.x - 25,
                  top: clickPosition.y - 25,
                  width: 50,
                  height: 50,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 42, opacity: 0 }}
                transition={{ duration: 3, delay: index * 0.3, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        
        {/* Final Color Takeover - Softer */}
        {isActive && (
          <motion.div
            key={`color-overlay-${themeId}`}
            className={`absolute inset-0 ${
              themeId === 'ocean-blue' ? 'bg-gradient-to-br from-blue-400/15 via-blue-300/8 to-transparent' :
              themeId === 'lavender-dreams' ? 'bg-gradient-to-br from-purple-400/12 via-pink-300/8 to-transparent' :
              themeId === 'warm-sunset' ? 'bg-gradient-to-br from-orange-400/15 via-yellow-300/8 to-transparent' :
              themeId === 'earthy-brown' ? 'bg-gradient-to-br from-amber-600/12 via-yellow-500/8 to-transparent' :
              themeId === 'peaceful-green' ? 'bg-gradient-to-br from-green-400/15 via-emerald-300/8 to-transparent' :
              ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}