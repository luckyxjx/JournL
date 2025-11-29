'use client';

import { motion } from 'framer-motion';
import { AvatarSystem } from '@/lib/core/user/avatar.service';
import { UserStats } from '@/lib/types/avatar';

interface AvatarProgressProps {
  stats: UserStats;
  className?: string;
}

export default function AvatarProgress({ stats, className = '' }: AvatarProgressProps) {
  const progress = AvatarSystem.getProgressToNextUnlock(stats);
  const topProgress = progress.slice(0, 3); // Show top 3 closest unlocks

  if (topProgress.length === 0) {
    return null;
  }

  return (
    <div className={`bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-2xl p-4 ${className}`}>
      <h3 className="text-lg font-serif font-semibold text-peaceful-text mb-3">
        🎯 Almost There!
      </h3>
      <div className="space-y-3">
        {topProgress.map(({ item, progress: progressValue }) => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-peaceful-text">{item.name}</span>
              <span className="text-xs text-peaceful-secondary">
                {Math.round(progressValue * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressValue * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-peaceful-accent h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-peaceful-secondary">
              {item.unlockCondition.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}