'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { WriteIcon } from './icons/MoodIcons';

export default function FloatingActionButton() {
  return (
    <Link href="/entry/new">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-peaceful-button to-peaceful-accent text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 border border-white/20"
      >
        <WriteIcon className="w-6 h-6" />
      </motion.button>
    </Link>
  );
}