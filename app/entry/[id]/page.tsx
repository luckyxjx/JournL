'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EntryEditor from '@/components/EntryEditor';
import MoodSelector from '@/components/MoodSelector';
import { entryRepository } from '@/lib/storage/EntryRepository';
import { LocalPhoto, JournalEntry, MoodTag } from '@/lib/storage/db';
import { motion, AnimatePresence } from 'framer-motion';
import { JoyIcon, CalmIcon, ReflectiveIcon, SadIcon } from '@/components/icons/MoodIcons';
import { PDFExportService } from '@/lib/export/PDFExportService';

type ViewMode = 'view' | 'edit' | 'continue';

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = params.id as string;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodTag | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load entry on mount
  useEffect(() => {
    const loadEntry = async () => {
      try {
        setIsLoading(true);
        const loadedEntry = await entryRepository.read(entryId);
        
        if (!loadedEntry) {
          setError('Entry not found');
          return;
        }

        setEntry(loadedEntry);
        setSelectedMood(loadedEntry.mood);
      } catch (err) {
        console.error('Failed to load entry:', err);
        setError('Failed to load entry');
      } finally {
        setIsLoading(false);
      }
    };

    if (entryId) {
      loadEntry();
    }
  }, [entryId]);

  const handleSave = async (editorContent: string, editorPhotos: LocalPhoto[]) => {
    if (!entry) return;

    try {
      setIsSaving(true);
      setError(null);

      // Calculate word count (strip HTML tags for accurate count)
      const textContent = editorContent.replace(/<[^>]*>/g, '');
      const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;

      // For "continue writing" mode, append new content
      let finalContent = editorContent;
      if (viewMode === 'continue') {
        // Append new content to existing content
        finalContent = entry.content + editorContent;
      }

      // Update entry in IndexedDB
      // IMPORTANT: Preserve createdAt timestamp (Requirement 3.2)
      await entryRepository.update(entryId, {
        content: finalContent,
        mood: (selectedMood as MoodTag) || entry.mood,
        photos: editorPhotos,
        updatedAt: new Date(), // Update the modified timestamp (Requirement 3.4)
        wordCount,
      });

      // Update local state
      setEntry({
        ...entry,
        content: finalContent,
        mood: (selectedMood as MoodTag) || entry.mood,
        photos: editorPhotos,
        updatedAt: new Date(),
        wordCount,
      });

      console.log('Entry updated successfully:', entryId);
    } catch (err) {
      console.error('Failed to update entry:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;

    try {
      // Requirement 3.3: Delete entry from IndexedDB
      await entryRepository.delete(entryId);
      router.push('/');
    } catch (err) {
      console.error('Failed to delete entry:', err);
      setError('Failed to delete entry. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const handleDone = () => {
    if (viewMode === 'view') {
      router.push('/');
    } else {
      // Return to view mode after editing
      setViewMode('view');
    }
  };

  const handleEdit = () => {
    setViewMode('edit');
  };

  const handleContinueWriting = () => {
    setViewMode('continue');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-peaceful-button border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error && !entry) {
    return (
      <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl bg-peaceful-button text-white hover:bg-peaceful-accent transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!entry) return null;

  return (
    <div className="min-h-screen bg-peaceful-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">
            {viewMode === 'view' ? 'Entry Details' : viewMode === 'edit' ? 'Edit Entry' : 'Continue Writing'}
          </h1>
          <div className="flex items-center gap-4 text-sm text-peaceful-text/60">
            <span>
              Created: {entry.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {entry.updatedAt.getTime() !== entry.createdAt.getTime() && (
              <span>
                • Last edited: {entry.updatedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        </motion.div>

        {/* View Mode - Display entry content (Requirement 3.1) */}
        {viewMode === 'view' && (
          <>
            {/* Mood Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-peaceful-text mb-3">
                Mood
              </label>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-peaceful-card/80 border border-peaceful-accent/20">
                {getMoodIcon(entry.mood)}
                <span className="text-peaceful-text font-medium capitalize">{entry.mood}</span>
              </div>
            </motion.div>

            {/* Content Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-peaceful-card/80 rounded-3xl shadow-sm border border-peaceful-accent/20 p-6">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                />
              </div>
            </motion.div>

            {/* Photos Display */}
            {entry.photos && entry.photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <label className="block text-sm font-medium text-peaceful-text mb-3">
                  Photos
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {entry.photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden">
                      <img
                        src={photo.dataUrl}
                        alt={photo.caption || 'Entry photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons - View Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-between"
            >
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="
                  px-6 py-3 rounded-xl font-medium
                  bg-red-500 text-white
                  hover:bg-red-600
                  transition-colors duration-200
                "
              >
                Delete Entry
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="
                    px-6 py-3 rounded-xl font-medium
                    bg-white text-peaceful-text
                    border border-peaceful-accent/30
                    hover:bg-peaceful-card/50
                    transition-colors duration-200
                  "
                >
                  Back
                </button>
                <button
                  onClick={() => PDFExportService.exportEntry(entry)}
                  className="
                    px-6 py-3 rounded-xl font-medium
                    bg-peaceful-accent text-white
                    hover:bg-peaceful-text
                    transition-colors duration-200
                  "
                >
                  Export PDF
                </button>
                <button
                  onClick={handleContinueWriting}
                  className="
                    px-6 py-3 rounded-xl font-medium
                    bg-peaceful-card text-peaceful-text
                    hover:bg-peaceful-button/50
                    transition-colors duration-200
                  "
                >
                  Continue Writing
                </button>
                <button
                  onClick={handleEdit}
                  className="
                    px-6 py-3 rounded-xl font-medium
                    bg-peaceful-button text-white
                    hover:bg-peaceful-accent
                    transition-colors duration-200
                  "
                >
                  Edit
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Edit/Continue Mode - Show editor */}
        {(viewMode === 'edit' || viewMode === 'continue') && (
          <>
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
                initialContent={viewMode === 'continue' ? '' : entry.content}
                initialPhotos={entry.photos}
                onSave={handleSave}
                placeholder={
                  viewMode === 'continue'
                    ? 'Continue writing your thoughts...'
                    : 'Edit your entry...'
                }
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

            {/* Action Buttons - Edit/Continue Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 justify-end"
            >
              <button
                onClick={() => setViewMode('view')}
                className="
                  px-6 py-3 rounded-xl font-medium
                  bg-white text-[#505D7F]
                  border border-gray-300
                  hover:bg-gray-50
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
                  bg-[#81C4B5] text-white
                  hover:bg-[#81C4B5]/90
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                "
              >
                {isSaving ? 'Saving...' : 'Done'}
              </button>
            </motion.div>
          </>
        )}

        {/* Offline Indicator */}
        {typeof window !== 'undefined' && !navigator.onLine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 text-sm flex items-center gap-2"
          >
            <OfflineIcon className="w-5 h-5" />
            <span>You&apos;re offline. Your changes will be saved locally.</span>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <DeleteConfirmDialog
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper function to get mood icon
function getMoodIcon(mood: MoodTag) {
  const moodIcons = {
    joy: JoyIcon,
    calm: CalmIcon,
    reflective: ReflectiveIcon,
    sad: SadIcon,
  };
  const IconComponent = moodIcons[mood] || JoyIcon;
  return <IconComponent className="w-6 h-6" />;
}

// Delete Confirmation Dialog Component
interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmDialog({ onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#505D7F]">Delete Entry?</h2>
        </div>

        <p className="text-[#8C9C92] mb-6">
          Are you sure you want to delete this entry? This action cannot be undone and all content, including photos, will be permanently removed.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="
              px-6 py-3 rounded-xl font-medium
              bg-white text-[#505D7F]
              border border-gray-300
              hover:bg-gray-50
              transition-colors duration-200
            "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="
              px-6 py-3 rounded-xl font-medium
              bg-red-500 text-white
              hover:bg-red-600
              transition-colors duration-200
            "
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
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
