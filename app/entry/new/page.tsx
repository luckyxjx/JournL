'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryEditor from '@/components/EntryEditor';
import MoodSelector from '@/components/MoodSelector';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { LocalPhoto, MoodTag } from '@/lib/storage/db';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import AuthGuard from '@/components/AuthGuard';

export default function NewEntryPage() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodTag | undefined>();
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);

  const handleSave = async (editorContent: string, editorPhotos: LocalPhoto[]) => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Update local state
      setContent(editorContent);
      setPhotos(editorPhotos);

      // Calculate word count (strip HTML tags for accurate count)
      const textContent = editorContent.replace(/<[^>]*>/g, '');
      const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;

      const now = new Date();
      
      if (savedEntryId) {
        // Update existing entry
        await entryRepository.update(savedEntryId, {
          content: editorContent,
          mood: selectedMood || 'calm',
          photos: editorPhotos,
          updatedAt: now,
          wordCount,
        });
      } else {
        // Create new entry
        const entryId = await entryRepository.create({
          userId: user?.id || 'guest',
          content: editorContent,
          mood: selectedMood || 'calm',
          photos: editorPhotos,
          createdAt: now,
          updatedAt: now,
          wordCount,
          encrypted: false,
        });
        setSavedEntryId(entryId);
      }
    } catch (err) {
      console.error('Failed to save entry:', err);
      setError('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDone = () => {
    // Navigate back to dashboard or entry list
    router.push('/');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-peaceful-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">New Entry</h1>
          <p className="text-peaceful-text/60">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-peaceful-text mb-3">
            How are you feeling?
          </label>
          <MoodSelector selectedMood={selectedMood} onMoodSelect={(tagId, label) => setSelectedMood(label.toLowerCase() as MoodTag)} />
        </motion.div>

        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <EntryEditor
            initialContent={content}
            initialPhotos={photos}
            onSave={handleSave}
            placeholder="Start writing your thoughts..."
          />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-end"
        >
          <button
            onClick={() => router.back()}
            className="
              px-6 py-3 rounded-xl font-medium
              bg-white text-peaceful-text
              border border-peaceful-accent/30
              hover:bg-peaceful-card/50
              transition-colors duration-200
            "
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={isSaving}
            className="
              px-6 py-3 rounded-xl font-medium
              bg-peaceful-button text-white
              hover:bg-peaceful-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {isSaving ? 'Saving...' : 'Done'}
          </button>
        </motion.div>

        {/* Offline Indicator */}
        {typeof window !== 'undefined' && !navigator.onLine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-sm flex items-center gap-2"
          >
            <OfflineIcon className="w-5 h-5" />
            <span>You&apos;re offline. Your entry will be saved locally.</span>
          </motion.div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}

// Offline Icon Component
function OfflineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
      />
    </svg>
  );
}
