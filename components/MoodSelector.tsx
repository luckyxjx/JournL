'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export type MoodTag = string;

export interface MoodIcon {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  color: string;
  bgColor: string;
}

const defaultMoods: MoodIcon[] = [
  { id: 'happy', icon: HappyIcon, label: 'Happy', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'excited', icon: ExcitedIcon, label: 'Excited', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'calm', icon: CalmIcon, label: 'Calm', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'thoughtful', icon: ThoughtfulIcon, label: 'Thoughtful', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'sad', icon: SadIcon, label: 'Sad', color: '#6B7280', bgColor: '#F3F4F6' },
  { id: 'anxious', icon: AnxiousIcon, label: 'Anxious', color: '#F97316', bgColor: '#FED7AA' },
  { id: 'grateful', icon: GratefulIcon, label: 'Grateful', color: '#EC4899', bgColor: '#FCE7F3' },
  { id: 'tired', icon: TiredIcon, label: 'Tired', color: '#6366F1', bgColor: '#E0E7FF' },
];

interface MoodSelectorProps {
  selectedMood?: MoodTag;
  onMoodSelect: (tagId: string, label: string) => void;
  className?: string;
}

export default function MoodSelector({ selectedMood, onMoodSelect, className = '' }: MoodSelectorProps) {
  const [customMood, setCustomMood] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomMoodSave = () => {
    if (customMood.trim()) {
      onMoodSelect('custom', customMood.trim());
      setShowCustomInput(false);
    }
  };

  const handleCustomMoodCancel = () => {
    setCustomMood('');
    setShowCustomInput(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Emoji Mood Options */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {defaultMoods.map((mood) => {
          const isSelected = selectedMood === mood.id;
          const IconComponent = mood.icon;
          
          return (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(mood.id, mood.label)}
              className={`
                relative p-3 md:p-4 rounded-2xl
                transition-all duration-200 ease-out
                flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px]
                shadow-md hover:shadow-lg
                ${isSelected ? 'ring-2 ring-offset-2 scale-105' : ''}
              `}
              style={{
                backgroundColor: isSelected ? mood.color + '20' : mood.bgColor,
                borderColor: isSelected ? mood.color : 'transparent',
                borderWidth: isSelected ? '2px' : '0px',
              }}
            >
              <IconComponent 
                className="w-6 h-6 md:w-8 md:h-8" 
                style={{ color: mood.color }}
              />
              <span 
                className="text-xs md:text-sm font-medium"
                style={{ color: mood.color }}
              >
                {mood.label}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: mood.color }}
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
        
        {/* Custom Mood Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCustomInput(true)}
          className={`
            relative p-3 md:p-4 rounded-2xl
            transition-all duration-200 ease-out
            flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px]
            shadow-md hover:shadow-lg
            ${selectedMood === 'custom'
              ? 'bg-peaceful-accent/20 ring-2 ring-peaceful-accent/50 scale-105'
              : 'bg-peaceful-card/50 hover:bg-peaceful-card/70 border-2 border-dashed border-peaceful-accent/30'
            }
          `}
        >
          <CustomIcon className="w-6 h-6 md:w-8 md:h-8 text-peaceful-accent" />
          <span className="text-xs md:text-sm text-peaceful-accent font-medium">
            Custom
          </span>
        </motion.button>
      </div>

      {/* Custom Mood Input */}
      {showCustomInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-peaceful-card/70 rounded-2xl p-4 border border-peaceful-accent/20"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={customMood}
              onChange={(e) => setCustomMood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCustomMoodSave();
                if (e.key === 'Escape') handleCustomMoodCancel();
              }}
              placeholder="How are you feeling?"
              maxLength={20}
              className="flex-1 px-3 py-2 rounded-xl bg-peaceful-bg border border-peaceful-accent/20 text-peaceful-text placeholder-peaceful-text/50 focus:outline-none focus:ring-2 focus:ring-peaceful-accent/50"
              autoFocus
            />
            <button
              onClick={handleCustomMoodSave}
              disabled={!customMood.trim()}
              className="px-4 py-2 bg-peaceful-accent text-white rounded-xl hover:bg-peaceful-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ✓
            </button>
            <button
              onClick={handleCustomMoodCancel}
              className="px-4 py-2 bg-peaceful-card text-peaceful-text rounded-xl hover:bg-peaceful-hover transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Custom Icon Components
function HappyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
      <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function ExcitedIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 9l2-2 2 2M15 9l2-2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <ellipse cx="12" cy="15" rx="3" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function CalmIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 10s0-2 2-2 2 2 2 2M14 10s0-2 2-2 2 2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ThoughtfulIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
      <path d="M10 16s1-1 2-1 2 1 2 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="4" r="1" fill="none" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );
}

function SadIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="9" r="1.5" fill="currentColor"/>
      <path d="M16 17s-1.5-2-4-2-4 2-4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M7 7l2 2M17 7l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function AnxiousIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
      <path d="M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function GratefulIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 10s0-2 2-2 2 2 2 2M14 10s0-2 2-2 2 2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function TiredIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 10h4M13 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 4l1 2M16 4l-1 2M20 8l-2 1M20 16l-2-1M4 8l2 1M4 16l2-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function CustomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}e="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function AnxiousIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
      <path d="M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function GratefulIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 10s0-2 2-2 2 2 2 2M14 10s0-2 2-2 2 2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function TiredIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 10h4M13 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 4l1 2M16 4l-1 2M20 8l-2 1M20 16l-2-1M4 8l2 1M4 16l2-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function CustomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}
