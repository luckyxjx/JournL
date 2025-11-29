'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AvatarItem } from '@/lib/types/avatar';
import Avatar from './Avatar';

interface AchievementNotificationProps {
  unlocks: AvatarItem[];
  onClose: () => void;
}

export default function AchievementNotification({ unlocks, onClose }: AchievementNotificationProps) {
  if (unlocks.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        className="fixed bottom-4 right-4 bg-peaceful-accent text-peaceful-bg p-4 rounded-2xl shadow-lg max-w-sm z-50"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="font-bold">New Avatar Items!</h3>
            <p className="text-sm opacity-90">
              {unlocks.length === 1 
                ? `You unlocked: ${unlocks[0].name}` 
                : `You unlocked ${unlocks.length} new items!`
              }
            </p>
          </div>
        </div>
        
        {unlocks.length === 1 && (
          <div className="flex items-center gap-2 mb-3">
            <Avatar avatar={{ [unlocks[0].type]: unlocks[0].id }} size="sm" />
            <span className="text-sm font-medium">{unlocks[0].name}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-lg text-sm"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              // This would open avatar customization
              onClose();
            }}
            className="flex-1 bg-white hover:bg-white/90 text-peaceful-accent px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Customize
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}