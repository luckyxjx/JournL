'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LocalPhoto } from '@/lib/storage/db';
import PhotoAttachment from './PhotoAttachment';
import { useAuth } from '@/lib/auth';

interface EntryEditorProps {
  initialContent?: string;
  initialPhotos?: LocalPhoto[];
  onSave?: (content: string, photos: LocalPhoto[]) => Promise<void>;
  placeholder?: string;
}

export default function EntryEditor({
  initialContent = '',
  initialPhotos = [],
  onSave,
  placeholder = 'Start writing your thoughts...',
}: EntryEditorProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [photos, setPhotos] = useState<LocalPhoto[]>(initialPhotos);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: initialContent,
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4 resize-none overflow-hidden',
      },
    },
    onUpdate: ({ editor }) => {
      // Trigger autosave with 500ms debounce
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      const timeout = setTimeout(() => {
        handleAutoSave(editor.getHTML());
      }, 500);

      setSaveTimeout(timeout);
    },
  });

  const handleAutoSave = useCallback(
    async (content: string) => {
      if (!onSave) return;

      setIsSaving(true);
      try {
        await onSave(content, photos);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save entry:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, photos]
  );

  const handlePhotosChange = useCallback((newPhotos: LocalPhoto[]) => {
    setPhotos(newPhotos);
    // Trigger save when photos change
    if (editor && onSave) {
      handleAutoSave(editor.getHTML());
    }
  }, [editor, onSave, handleAutoSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Formatting Toolbar */}
      <div className="sticky top-0 z-10 bg-peaceful-card/95 backdrop-blur-sm border-b border-peaceful-accent/20 rounded-t-3xl shadow-sm">
        <div className="flex flex-wrap gap-1 p-3">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <BoldIcon />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <HighlightIcon />
          </ToolbarButton>

          <div className="w-px h-8 bg-gray-300 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <BulletListIcon />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            title="Todo List"
          >
            <TodoIcon />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-peaceful-card rounded-b-3xl shadow-sm border border-t-0 border-peaceful-accent/20">
        <div className="[&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:max-h-none [&_.ProseMirror]:overflow-visible">
          <EditorContent editor={editor} />
        </div>
        
        {/* Photo Attachment inside editor */}
        <div className="px-4 pb-4 border-t border-peaceful-accent/10">
          <PhotoAttachment photos={photos} onPhotosChange={handlePhotosChange} />
        </div>
      </div>

      {/* Autosave Indicator */}
      <AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
    </div>
  );
}

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded-lg transition-colors duration-200
        hover:bg-peaceful-button/20
        ${isActive ? 'bg-peaceful-button/30 text-peaceful-text' : 'text-peaceful-text/60'}
      `}
    >
      {children}
    </button>
  );
}

// Autosave Indicator Component
interface AutosaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
}

function AutosaveIndicator({ isSaving, lastSaved }: AutosaveIndicatorProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mt-2 text-sm text-gray-500"
    >
      {isSaving ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4"
          >
            <SaveIcon />
          </motion.div>
          <span>Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <CheckIcon className="w-4 h-4 text-peaceful-accent" />
          <span>Saved {getTimeAgo(lastSaved)}</span>
        </>
      ) : null}
    </motion.div>
  );
}

// Icon Components
function BoldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
      />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 4v7a6 6 0 0012 0V4M4 20h16"
      />
    </svg>
  );
}

function HighlightIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
      />
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function TodoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
