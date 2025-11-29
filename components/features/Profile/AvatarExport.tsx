'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserAvatar } from '@/lib/types/avatar';
import Avatar from './Avatar';

interface AvatarExportProps {
  avatar: UserAvatar;
  username: string;
  onClose: () => void;
}

export default function AvatarExport({ avatar, username, onClose }: AvatarExportProps) {
  const [exportSize, setExportSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showSuccess, setShowSuccess] = useState(false);

  const exportAsPNG = async () => {
    const svg = document.querySelector('#export-avatar svg') as SVGElement;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sizes = { sm: 64, md: 128, lg: 256 };
    const size = sizes[exportSize];
    
    canvas.width = size;
    canvas.height = size;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      
      const link = document.createElement('a');
      link.download = `${username}-avatar-${size}x${size}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyShareText = () => {
    const text = `Check out my journL avatar! I&apos;ve been journaling consistently and unlocked some cool customizations. 📝✨`;
    navigator.clipboard.writeText(text);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-peaceful-text">Share Avatar</h2>
          <button
            onClick={onClose}
            className="text-peaceful-secondary hover:text-peaceful-text transition-colors p-2"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <div id="export-avatar" className="inline-block mb-4">
            <Avatar avatar={avatar} size={exportSize} />
          </div>
          <p className="text-peaceful-text font-medium">{username}&apos;s Avatar</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-peaceful-text mb-2">Export Size</label>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setExportSize(size)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    exportSize === size
                      ? 'bg-peaceful-accent text-peaceful-bg'
                      : 'bg-white/20 text-peaceful-text hover:bg-white/30'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportAsPNG}
              className="flex-1 bg-peaceful-accent text-peaceful-bg py-3 rounded-xl font-medium hover:bg-peaceful-accent/90 transition-colors"
            >
              📥 Download PNG
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyShareText}
              className="flex-1 bg-white/20 text-peaceful-text py-3 rounded-xl font-medium hover:bg-white/30 transition-colors"
            >
              📋 Copy Text
            </motion.button>
          </div>
        </div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-500/20 text-green-700 rounded-xl text-center text-sm"
          >
            ✅ Success!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}