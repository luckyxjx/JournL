'use client';

import { useState } from 'react';
import EntryEditor from '@/components/features/Journal/EntryEditor';
import MoodSelector, { type MoodTag } from '@/components/features/Journal/MoodSelector';
import { LocalPhoto } from '@/lib/storage/db';

export default function EditorDemoPage() {
  const [savedContent, setSavedContent] = useState<string>('');
  const [savedPhotos, setSavedPhotos] = useState<LocalPhoto[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodTag | undefined>();

  const handleSave = async (content: string, photos: LocalPhoto[]) => {
    // Simulate async save operation
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSavedContent(content);
    setSavedPhotos(photos);
    console.log('Content saved:', content);
    console.log('Photos saved:', photos.length);
    console.log('Selected mood:', selectedMood);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9AD4EA] to-[#ECBEDB] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#505D7F] mb-2">
            Journal Entry Editor
          </h1>
          <p className="text-[#505D7F]/70">
            Start writing your thoughts with rich text formatting
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#505D7F] mb-3">
              How are you feeling?
            </h3>
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
            />
          </div>

          <EntryEditor
            initialContent="<p>Welcome to your journal! Try out the formatting options above.</p>"
            onSave={handleSave}
            placeholder="What's on your mind today?"
          />
        </div>

        {savedContent && (
          <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-[#505D7F] mb-4">
              Saved Content Preview
            </h2>
            {selectedMood && (
              <div className="mb-4">
                <span className="text-sm text-[#505D7F]/70">Mood: </span>
                <span className="text-sm font-medium text-[#505D7F] capitalize">
                  {selectedMood}
                </span>
              </div>
            )}
            {savedPhotos.length > 0 && (
              <div className="mb-4">
                <span className="text-sm text-[#505D7F]/70">
                  Photos attached: {savedPhotos.length}
                </span>
              </div>
            )}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
