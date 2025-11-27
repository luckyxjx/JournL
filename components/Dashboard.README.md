# Dashboard Component

## Overview

The Dashboard component is the main home screen of CalmJournal, providing users with a comprehensive view of their journaling activity and quick access to key features.

## Features

### 1. Today's Mood Card
- Displays mood selector for the current day
- Automatically shows mood if user has already created an entry today
- Updates existing entry's mood if changed
- Uses the MoodSelector component with the app's color palette

### 2. Recent Entries Preview
- Shows the 3 most recent journal entries
- Displays entry excerpt (first 100 characters)
- Shows mood emoji and relative date
- Clickable to navigate to full entry detail
- Empty state when no entries exist

### 3. Streak Counter
- Calculates consecutive days of journaling
- Animated display with fire emoji
- Counts multiple entries per day as single streak day
- Resets when a day is missed
- Uses spring animation for number changes

### 4. New Entry Button
- Prominent call-to-action button
- Gradient styling matching the app theme
- Navigates to `/entry/new` page
- Hover and tap animations

### 5. Offline Indicator
- Detects online/offline status using `navigator.onLine`
- Shows banner when offline
- Reassures users that entries are saved locally
- Listens to online/offline events for real-time updates

## Data Flow

1. **On Mount:**
   - Loads 3 most recent entries from IndexedDB
   - Calculates current streak
   - Checks if user has entry today
   - Sets up online/offline listeners

2. **Mood Selection:**
   - Updates local state
   - If entry exists today, updates its mood in IndexedDB
   - Otherwise, mood will be used when creating new entry

3. **Streak Calculation:**
   - Gets all entries sorted by date
   - Extracts unique entry dates
   - Counts consecutive days from today/yesterday backwards
   - Returns 0 if no recent entries

## Styling

- Uses the CalmJournal color palette:
  - Background: Gradient from Calm Blue (#9AD4EA) to Lilac Mist (#ECBEDB)
  - Text: Deep Lavender (#505D7F)
  - Cards: White with 80% opacity and backdrop blur
  - Buttons: Soft Mint (#81C4B5) to Calm Blue gradient
  
- Rounded corners: 24-32px for soft, calming aesthetic
- Smooth animations using Framer Motion
- Responsive layout with max-width container

## Requirements Validated

This component satisfies the following requirements:

- **8.1**: Displays mood selection card for current day
- **8.2**: Shows previews of 3 most recent entries
- **8.3**: Displays current writing streak count
- **8.4**: Provides prominent new entry button
- **8.5**: Shows offline indicator when disconnected

## Usage

```tsx
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return <Dashboard />;
}
```

## Dependencies

- `framer-motion`: Animations
- `next/link`: Navigation
- `@/lib/storage/EntryRepository`: Data access
- `@/components/MoodSelector`: Mood selection UI

## Future Enhancements

- Add pull-to-refresh functionality
- Show loading skeleton instead of "Loading..." text
- Add quick stats (total entries, favorite mood)
- Implement search functionality
- Add filter by mood
