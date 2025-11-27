'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export type MoodTag = string;

export interface CustomTag {
  id: string;
  label: string;
  color: string;
}

const defaultTags: CustomTag[] = [
  { id: '1', label: 'Joy', color: '#9ED5C5' },
  { id: '2', label: 'Calm', color: '#8EC3B0' },
  { id: '3', label: 'Reflective', color: '#BCEAD5' },
  { id: '4', label: 'Thoughtful', color: '#628E75' },
];

interface TagSelectorProps {
  selectedMood?: MoodTag;
  onMoodSelect: (tagId: string, label: string) => void;
  className?: string;
}

export default function MoodSelector({ selectedMood, onMoodSelect, className = '' }: TagSelectorProps) {
  const [tags, setTags] = useState<CustomTag[]>(defaultTags);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleTagEdit = (tagId: string, currentLabel: string) => {
    setEditingTag(tagId);
    setEditValue(currentLabel);
  };

  const handleSaveEdit = (tagId: string) => {
    if (editValue.trim() && editValue.length <= 15) {
      setTags(prev => prev.map(tag => 
        tag.id === tagId ? { ...tag, label: editValue.trim() } : tag
      ));
    }
    setEditingTag(null);
    setEditValue('');
  };

  const getTextColor = (bgColor: string) => {
    // Check if dark theme is active
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDarkTheme) {
      return '#e6f5ed'; // Use bright text in dark mode for visibility
    }
    
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#2D3748' : '#FFFFFF';
  };

  return (
    <div className={`flex flex-wrap gap-2 md:gap-3 ${className}`}>
      {tags.map((tag) => {
        const isSelected = selectedMood === tag.id;
        const isEditing = editingTag === tag.id;
        const textColor = getTextColor(tag.color);
        
        return (
          <motion.div
            key={tag.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              mood-tag relative px-3 md:px-4 py-2 md:py-3 rounded-2xl font-medium text-xs md:text-sm
              transition-all duration-200 ease-out
              flex items-center gap-1 md:gap-2 min-w-[80px] md:min-w-[100px] justify-center
              ${isSelected 
                ? 'shadow-lg ring-2 ring-white ring-offset-2 scale-105' 
                : 'shadow-md hover:shadow-lg'
              }
            `}
            style={{ backgroundColor: tag.color }}
          >
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveEdit(tag.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(tag.id);
                  if (e.key === 'Escape') { setEditingTag(null); setEditValue(''); }
                }}
                maxLength={15}
                className="bg-transparent border-none outline-none text-center w-full"
                style={{ color: textColor }}
                autoFocus
              />
            ) : (
              <>
                <button
                  onClick={() => onMoodSelect(tag.id, tag.label)}
                  className="flex-1 text-center"
                  style={{ color: textColor }}
                >
                  {tag.label}
                </button>
                <button
                  onClick={() => handleTagEdit(tag.id, tag.label)}
                  className="ml-1 opacity-60 hover:opacity-100"
                  style={{ color: textColor }}
                >
                  ✎
                </button>
              </>
            )}
            
            {isSelected && !isEditing && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1"
                style={{ color: textColor }}
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
