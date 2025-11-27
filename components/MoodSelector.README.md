# MoodSelector Component

A visual mood tag selector component for journal entries, featuring four mood options with distinct colors and emojis.

## Features

- **Four Mood Options**: Joy, Calm, Reflective, and Sad
- **Color-Coded**: Each mood has a unique color from the CalmJournal palette
  - Joy → Pastel Pink (#F4B0BD)
  - Calm → Soft Mint (#81C4B5)
  - Reflective → Lilac Mist (#ECBEDB)
  - Sad → Warm Gray (#8C9C92)
- **Visual Feedback**: Selected mood shows a checkmark and ring highlight
- **Smooth Animations**: Hover and tap animations using Framer Motion
- **Accessible**: Proper ARIA labels and pressed states

## Usage

```tsx
import MoodSelector, { MoodTag } from '@/components/MoodSelector';

function MyComponent() {
  const [mood, setMood] = useState<MoodTag | undefined>();

  return (
    <MoodSelector
      selectedMood={mood}
      onMoodSelect={setMood}
      className="my-4"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedMood` | `MoodTag \| undefined` | No | Currently selected mood |
| `onMoodSelect` | `(mood: MoodTag) => void` | Yes | Callback when a mood is selected |
| `className` | `string` | No | Additional CSS classes for the container |

## Types

```typescript
export type MoodTag = 'joy' | 'calm' | 'reflective' | 'sad';
```

## Design Decisions

1. **Color Mapping**: Colors are mapped according to the design specification in Requirements 2.2
2. **Emoji Icons**: Each mood has an emoji for quick visual recognition
3. **Responsive**: Uses flexbox with wrapping for mobile compatibility
4. **Animations**: Subtle scale animations on hover/tap for better UX
5. **Accessibility**: Full keyboard navigation and screen reader support

## Requirements Validation

This component satisfies **Requirement 2.2**:
> WHEN a user selects a mood tag THEN the CalmJournal SHALL associate the selected mood (Joy, Calm, Reflective, Sad) with the entry

The component provides a clear interface for mood selection with proper visual feedback and color coding as specified in the design document.
