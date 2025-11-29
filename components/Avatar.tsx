'use client';

import { motion } from 'framer-motion';
import { UserAvatar } from '@/lib/types/avatar';
import { AvatarSVGComponents } from './AvatarIcons';

interface AvatarProps {
  avatar: UserAvatar;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ avatar, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background/Aura - with animation */}
        {avatar.background && (
          <motion.g
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {AvatarSVGComponents[avatar.background as keyof typeof AvatarSVGComponents]}
          </motion.g>
        )}
        
        {/* Base Avatar Circle */}
        <circle cx="50" cy="50" r="35" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="2" />
        
        {/* Hat - with bounce animation */}
        {avatar.hat && (
          <motion.g
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            {AvatarSVGComponents[avatar.hat as keyof typeof AvatarSVGComponents]}
          </motion.g>
        )}
        
        {/* Eyes */}
        {avatar.eyes ? 
          AvatarSVGComponents[avatar.eyes as keyof typeof AvatarSVGComponents] :
          // Default eyes
          <g>
            <circle cx="35" cy="45" r="2" fill="#2D3748" />
            <circle cx="65" cy="45" r="2" fill="#2D3748" />
          </g>
        }
        
        {/* Mouth */}
        <path d="M40 60 Q50 70 60 60" stroke="#2D3748" strokeWidth="2" fill="none" />
        
        {/* Accessories */}
        {avatar.accessory && AvatarSVGComponents[avatar.accessory as keyof typeof AvatarSVGComponents]}
      </svg>
    </div>
  );
}