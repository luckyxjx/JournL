# PhotoAttachment Component

## Overview

The `PhotoAttachment` component provides a privacy-first photo attachment interface for journal entries. All photos are stored locally in IndexedDB as base64-encoded data URLs and never transmitted to the cloud.

## Features

- **Local Storage Only**: Photos are converted to base64 and stored in IndexedDB
- **Size Limit**: Enforces 2MB maximum file size (configurable)
- **Automatic Compression**: Compresses images that exceed the size limit
- **Multiple Upload**: Supports selecting multiple photos at once
- **Visual Feedback**: Shows upload progress and error messages
- **Delete Capability**: Users can remove attached photos
- **Responsive Grid**: Photos display in a responsive grid layout
- **Smooth Animations**: Uses Framer Motion for polished transitions

## Usage

```tsx
import PhotoAttachment from '@/components/PhotoAttachment';
import { LocalPhoto } from '@/lib/storage/db';

function MyComponent() {
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);

  return (
    <PhotoAttachment
      photos={photos}
      onPhotosChange={setPhotos}
      maxSizeMB={2}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `photos` | `LocalPhoto[]` | Required | Array of currently attached photos |
| `onPhotosChange` | `(photos: LocalPhoto[]) => void` | Required | Callback when photos are added or removed |
| `maxSizeMB` | `number` | `2` | Maximum file size in megabytes |

## LocalPhoto Interface

```typescript
interface LocalPhoto {
  id: string;           // Unique identifier (UUID)
  dataUrl: string;      // Base64-encoded image data
  caption?: string;     // Optional caption (future feature)
  addedAt: Date;        // Timestamp when photo was added
}
```

## Image Processing

### Validation
1. Checks if file is an image type
2. Validates file size against `maxSizeMB` limit
3. Shows error message if validation fails

### Compression
If an image exceeds the size limit, it is automatically compressed:
1. Resizes to max 1920px width/height (maintains aspect ratio)
2. Converts to JPEG format
3. Reduces quality incrementally until size is acceptable
4. Minimum quality: 0.1 (10%)

### Base64 Encoding
All images are converted to base64 data URLs for storage in IndexedDB:
- Allows storage without separate file system
- Enables offline functionality
- Simplifies data export/import
- No server upload required

## Privacy Guarantees

✅ **Photos never leave the device**
- Stored only in browser's IndexedDB
- No network requests made with photo data
- Not included in cloud metadata sync

✅ **Complete user control**
- Users can delete photos anytime
- Photos are included in data export
- Photos are removed when entry is deleted

## Styling

The component uses the CalmJournal color palette:
- Upload button: Calm Blue (#9AD4EA) background
- Text: Deep Lavender (#505D7F)
- Delete button: Red with hover effect
- Rounded corners: 20-32px for calming aesthetic

## Accessibility

- Keyboard accessible file input
- Clear button labels and titles
- Error messages for screen readers
- Sufficient color contrast
- Touch-friendly button sizes

## Performance Considerations

- Image compression reduces storage usage
- Lazy loading for photo thumbnails
- Efficient base64 encoding
- Debounced save when photos change

## Future Enhancements

- Photo captions
- Photo reordering (drag and drop)
- Photo editing (crop, rotate, filters)
- Multiple photo selection from gallery
- Camera capture on mobile devices
