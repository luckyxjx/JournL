'use client';

import { motion } from 'framer-motion';
import { UserAvatar } from '@/lib/types/avatar';
import { AvatarSVGComponents, AvatarBaseParts } from './AvatarIcons';

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
        
        {/* Base Avatar Body */}
        {AvatarBaseParts.body}
        
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
            <circle cx="45" cy="32" r="2" fill="#2D3748" />
            <circle cx="55" cy="32" r="2" fill="#2D3748" />
          </g>
        }
        
        {/* Mouth */}
        <path d="M45 40 Q50 43 55 40" stroke="#2D3748" strokeWidth="2" fill="none" />
        
        {/* Clothing */}
        {avatar.clothing && (
          <motion.g
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {AvatarSVGComponents[avatar.clothing as keyof typeof AvatarSVGComponents]}
          </motion.g>
        )}
        
        {/* Accessories - with slide-in animation */}
        {avatar.accessory && (
          <motion.g
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {AvatarSVGComponents[avatar.accessory as keyof typeof AvatarSVGComponents]}
          </motion.g>
        )}
      </svg>
    </div>
  );
}