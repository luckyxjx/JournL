'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setShowIndicator(true);
      
      // Hide indicator after 3 seconds if back online
      if (online) {
        setTimeout(() => setShowIndicator(false), 3000);
      }
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <AnimatePresence>
      {(showIndicator || !isOnline) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-md ${
            isOnline
              ? 'bg-green-500/90 text-white'
              : 'bg-peaceful-warm/90 border border-peaceful text-peaceful-text'
          }`}
        >
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Back online
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-peaceful-accent rounded-full" />
                Offline - Your entries are saved locally
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}