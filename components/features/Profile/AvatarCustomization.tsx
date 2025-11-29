'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarSystem } from '@/lib/core/user/avatar.service';
import { AvatarItem, UserAvatar, AvatarItemType } from '@/lib/types/avatar';
import Avatar from './Avatar';

interface AvatarCustomizationProps {
  onClose: () => void;
}

export default function AvatarCustomization({ onClose }: AvatarCustomizationProps) {
  const [currentAvatar, setCurrentAvatar] = useState<UserAvatar>({});
  const [selectedCategory, setSelectedCategory] = useState<AvatarItemType>('eyes');
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [showUnlockNotification, setShowUnlockNotification] = useState<AvatarItem | null>(null);

  useEffect(() => {
    setCurrentAvatar(AvatarSystem.getUserAvatar());
    setUnlockedItems(AvatarSystem.getUnlockedItems());
  }, []);

  const categories: { type: AvatarItemType; label: string; icon: string }[] = [
    { type: 'eyes', label: 'Eyes', icon: '👀' },
    { type: 'hat', label: 'Hats', icon: '🎩' },
    { type: 'accessory', label: 'Accessories', icon: '📷' },
    { type: 'background', label: 'Effects', icon: '✨' },
  ];

  const getItemsForCategory = (category: AvatarItemType): AvatarItem[] => {
    return AvatarSystem.getAvailableItems().filter(item => item.type === category);
  };

  const isItemUnlocked = (itemId: string): boolean => {
    return unlockedItems.includes(itemId);
  };

  const selectItem = (item: AvatarItem) => {
    if (!isItemUnlocked(item.id)) return;

    const newAvatar = { ...currentAvatar };
    
    // Toggle item (remove if already selected, add if not)
    if (newAvatar[item.type] === item.id) {
      delete newAvatar[item.type];
    } else {
      newAvatar[item.type] = item.id;
    }
    
    setCurrentAvatar(newAvatar);
    AvatarSystem.updateUserAvatar(newAvatar);
  };

  const isItemSelected = (item: AvatarItem): boolean => {
    return currentAvatar[item.type] === item.id;
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
        className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-peaceful-text">Customize Avatar</h2>
          <button
            onClick={onClose}
            className="text-peaceful-secondary hover:text-peaceful-text transition-colors p-2"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Preview */}
          <div className="flex-shrink-0">
            <div className="bg-white/20 rounded-2xl p-6 text-center">
              <Avatar avatar={currentAvatar} size="lg" className="mx-auto mb-4" />
              <p className="text-sm text-peaceful-secondary">Your Avatar</p>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="flex-1 min-h-0">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.type}
                  onClick={() => setSelectedCategory(category.type)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                    selectedCategory === category.type
                      ? 'bg-peaceful-accent text-peaceful-bg'
                      : 'bg-white/20 text-peaceful-text hover:bg-white/30'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="overflow-y-auto max-h-64">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getItemsForCategory(selectedCategory).map((item) => {
                  const unlocked = isItemUnlocked(item.id);
                  const selected = isItemSelected(item);

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={unlocked ? { scale: 1.05 } : {}}
                      whileTap={unlocked ? { scale: 0.95 } : {}}
                      onClick={() => selectItem(item)}
                      disabled={!unlocked}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-peaceful-accent bg-peaceful-accent/20'
                          : unlocked
                          ? 'border-white/20 bg-white/10 hover:border-white/40'
                          : 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                        {unlocked ? (
                          <Avatar 
                            avatar={{ [item.type]: item.id }} 
                            size="sm" 
                          />
                        ) : (
                          <span className="text-gray-400">🔒</span>
                        )}
                      </div>
                      <p className={`text-xs font-medium ${unlocked ? 'text-peaceful-text' : 'text-gray-400'}`}>
                        {item.name}
                      </p>
                      {!unlocked && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.unlockCondition.description}
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 bg-peaceful-accent text-peaceful-bg rounded-xl font-medium hover:bg-peaceful-accent/90 transition-colors"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>

      {/* Unlock Notification */}
      <AnimatePresence>
        {showUnlockNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-peaceful-accent text-peaceful-bg p-4 rounded-xl shadow-lg"
          >
            <p className="font-medium">🎉 New item unlocked!</p>
            <p className="text-sm opacity-90">{showUnlockNotification.name}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}