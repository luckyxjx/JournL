# Entry Creation and Editing Flow Implementation

This document describes the implementation of the entry creation and editing flow for CalmJournal.

## Overview

The entry flow allows users to create new journal entries and edit existing ones with rich text formatting, mood tags, and photo attachments. All data is stored locally in IndexedDB, ensuring complete privacy.

## Implementation Details

### New Entry Page (`/entry/new`)

**Location:** `app/entry/new/page.tsx`

**Features:**
- Rich text editor with formatting toolbar (bold, underline, highlight, bullets, todos)
- Mood selector with 4 mood options (Joy, Calm, Reflective, Sad)
- Photo attachment with compression and size limits
- Autosave functionality with 500ms debounce
- Offline indicator when network is unavailable
- UUID generation for unique entry IDs
- Timestamp capture (createdAt and updatedAt)

**Data Flow:**
1. User writes content in the editor
2. User selects a mood (optional)
3. User attaches photos (optional)
4. Content is auto-saved to IndexedDB via `EntryRepository`
5. Entry ID is generated using `crypto.randomUUID()`
6. Timestamps are captured at creation time
7. Word count is calculated by stripping HTML tags

### Edit Entry Page (`/entry/[id]`)

**Location:** `app/entry/[id]/page.tsx`

**Features:**
- Loads existing entry from IndexedDB
- Displays creation and last edit timestamps
- Preserves original `createdAt` timestamp when editing (Requirement 3.2)
- Updates `updatedAt` timestamp on each save
- Delete functionality with confirmation dialog
- Same rich text editor, mood selector, and photo attachment as new entry
- Offline indicator

**Data Flow:**
1. Entry is loaded from IndexedDB using entry ID from URL
2. Editor is initialized with existing content, mood, and photos
3. User makes changes
4. Changes are auto-saved to IndexedDB
5. `createdAt` timestamp is preserved (not updated)
6. `updatedAt` timestamp is set to current time
7. Word count is recalculated

### Key Components Used

1. **EntryEditor** (`components/EntryEditor.tsx`)
   - Tiptap-based rich text editor
   - Formatting toolbar
   - Autosave with debounce
   - Photo attachment integration

2. **MoodSelector** (`components/MoodSelector.tsx`)
   - Visual mood tag picker
   - 4 mood options with colors and emojis
   - Animated selection feedback

3. **PhotoAttachment** (`components/PhotoAttachment.tsx`)
   - File upload with validation
   - Image compression for size limits
   - Base64 encoding for IndexedDB storage
   - Delete functionality

4. **EntryRepository** (`lib/storage/EntryRepository.ts`)
   - CRUD operations for journal entries
   - IndexedDB wrapper using Dexie.js
   - UUID generation
   - Query and search capabilities

## Requirements Validation

### Requirement 2.4: Entry Persistence
✅ **WHEN a user saves an entry THEN the CalmJournal SHALL persist the complete entry to IndexedDB immediately**

Implementation:
- `entryRepository.create()` saves entry to IndexedDB
- All fields are persisted: content, mood, photos, timestamps, wordCount
- Autosave ensures immediate persistence

### Requirement 2.5: Offline Entry Creation
✅ **WHEN a user creates an entry without internet connection THEN the CalmJournal SHALL save the entry successfully to local storage**

Implementation:
- IndexedDB works completely offline
- Offline indicator shows when network is unavailable
- All operations are local-first
- No network requests required for entry creation

### Requirement 3.2: Timestamp Preservation
✅ **WHEN a user edits an existing entry THEN the CalmJournal SHALL update the entry in IndexedDB and preserve the original creation timestamp**

Implementation:
- Edit page only updates specific fields
- `createdAt` is never included in update operations
- `updatedAt` is set to current time on each save
- Comment in code explicitly notes this requirement

## Testing

### Unit Tests (`__tests__/entry-flow.test.ts`)

The following tests verify the entry creation and editing flow:

1. ✅ Create new entry with all required fields
2. ✅ Generate unique UUID for each entry
3. ✅ Preserve createdAt timestamp when editing
4. ✅ Save entry with photos
5. ✅ Work offline (without network connection)
6. ✅ Capture both createdAt and updatedAt timestamps
7. ✅ Update updatedAt timestamp when editing
8. ✅ Handle mood selection

All tests pass successfully.

## Offline Support

The entry flow is fully offline-capable:

- **IndexedDB** is used for all storage (no network required)
- **Offline indicator** shows when network is unavailable
- **All operations** work identically online and offline
- **Photos** are stored as base64 data URLs in IndexedDB
- **No cloud sync** for entry content (privacy-first design)

## Future Enhancements

Potential improvements for future iterations:

1. **Continue Writing Feature** (Requirement 3.4)
   - Add "Continue Writing" button to append content
   - Preserve existing content and add new content below

2. **Entry Detail View** (Requirement 3.1)
   - Read-only view of entry with all components
   - Display full entry text, mood, timestamps, photos

3. **PDF Export** (Requirement 3.5)
   - Client-side PDF generation
   - Include all entry content and photos

4. **Encryption** (Requirement 11.3)
   - Optional AES-256 encryption for entry content
   - Password-based key derivation

5. **Cloud Metadata Sync** (Requirement 7.1)
   - Sync mood summaries and word counts
   - Never sync entry content (privacy-first)

## Architecture Notes

### Data Model

```typescript
interface JournalEntry {
  id: string;              // UUID generated by crypto.randomUUID()
  userId: string;          // User identifier (guest or authenticated)
  content: string;         // Rich text HTML from Tiptap
  mood: MoodTag;          // 'joy' | 'calm' | 'reflective' | 'sad'
  photos: LocalPhoto[];   // Array of base64-encoded photos
  createdAt: Date;        // Entry creation timestamp (immutable)
  updatedAt: Date;        // Last modification timestamp
  wordCount: number;      // Calculated from plain text content
  encrypted: boolean;     // Whether content is encrypted
}
```

### Storage Strategy

- **Primary Storage:** IndexedDB via Dexie.js
- **Photos:** Base64 data URLs stored in entry object
- **Encryption:** Optional AES-256-GCM (future feature)
- **Sync:** Metadata only, never content (privacy-first)

### Performance Considerations

- **Autosave Debounce:** 500ms to prevent excessive writes
- **Photo Compression:** Images compressed to stay under 2MB
- **Word Count:** Calculated on save, not on every keystroke
- **Virtual Scrolling:** For long entry lists (future feature)

## Conclusion

The entry creation and editing flow is fully implemented and tested. It provides a complete journaling experience with rich text editing, mood tracking, and photo attachments, all while maintaining complete privacy through local-only storage.
