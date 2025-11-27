# Entry Editor Component

A rich text editor component for journal entries built with Tiptap, featuring formatting tools, autosave functionality, and a calming aesthetic.

## Features

### Rich Text Formatting
- **Bold**: Make text bold for emphasis
- **Underline**: Underline important text
- **Highlight**: Highlight text with pastel pink background
- **Bullet Lists**: Create unordered lists
- **Todo Lists**: Create interactive checkbox lists

### Autosave Functionality
- Automatic saving with 500ms debounce
- Visual autosave indicator showing save status
- "Saving..." animation during save
- "Saved X ago" timestamp after successful save

### Calming Aesthetic
- Rounded corners (32px) for a soft appearance
- Color palette integration (Calm Blue #9AD4EA, Soft Mint #81C4B5, etc.)
- Smooth transitions and animations
- Clean, minimal toolbar design

## Usage

```tsx
import EntryEditor from '@/components/EntryEditor';

function MyComponent() {
  const handleSave = async (content: string) => {
    // Save the HTML content to your storage
    await saveToDatabase(content);
  };

  return (
    <EntryEditor
      initialContent="<p>Start writing...</p>"
      onSave={handleSave}
      placeholder="What's on your mind today?"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | `string` | `''` | Initial HTML content for the editor |
| `onSave` | `(content: string) => Promise<void>` | `undefined` | Callback function called when content changes (debounced 500ms) |
| `placeholder` | `string` | `'Start writing your thoughts...'` | Placeholder text shown in empty editor |

## Components

### EntryEditor
Main editor component that orchestrates the toolbar, editor content, and autosave indicator.

### ToolbarButton
Reusable button component for formatting actions with active state styling.

### AutosaveIndicator
Displays save status with animated icons and time-ago formatting.

## Styling

The editor uses Tailwind CSS with custom styles defined in `app/globals.css`:
- `.ProseMirror` - Main editor styles
- Custom styles for lists, checkboxes, highlights, and more
- Color palette integration throughout

## Technical Details

### Libraries
- **@tiptap/react**: Core editor framework
- **@tiptap/starter-kit**: Basic editing extensions
- **@tiptap/extension-underline**: Underline formatting
- **@tiptap/extension-highlight**: Text highlighting
- **@tiptap/extension-task-list**: Todo list support
- **@tiptap/extension-task-item**: Individual todo items
- **framer-motion**: Smooth animations

### Autosave Implementation
- Uses `onUpdate` callback from Tiptap
- Debounces save calls with 500ms delay using `setTimeout`
- Cleans up timeout on component unmount
- Tracks save state (`isSaving`, `lastSaved`)

### Accessibility
- Toolbar buttons have descriptive `title` attributes
- Editor is keyboard navigable
- Proper ARIA roles for interactive elements

## Requirements Satisfied

✅ **Requirement 2.1**: Rich text editor supporting bold, underline, highlight, bullets, and todos  
✅ **Task 7**: Formatting toolbar with all specified options  
✅ **Task 7**: Autosave functionality with 500ms debounce  
✅ **Task 7**: Autosave indicator component  
✅ **Task 7**: Calming aesthetic with color palette integration

## Demo

A demo page is available at `/editor-demo` showing the editor in action with a preview of saved content.

## Testing

Unit tests are located in `__tests__/entry-editor.test.tsx` and cover:
- Toolbar button rendering
- Initial content display
- Prop acceptance
- Button interactions

Run tests with:
```bash
npm test -- entry-editor.test.tsx
```
