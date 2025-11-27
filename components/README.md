# Splash Screen and Onboarding Components

This directory contains the splash screen and onboarding flow components for Calm Journal.

## Components

### SplashScreen.tsx
A beautiful splash screen with a gradient background (Calm Blue to Lilac Mist) that displays when the app first loads. Features:
- Smooth fade animations using Framer Motion
- Gradient background matching the app's color palette
- Automatic transition after 1.5 seconds
- Callback support for completion handling

### OnboardingCarousel.tsx
An interactive onboarding carousel that introduces new users to the app's privacy features. Features:
- 4 slides explaining privacy, mood tracking, and offline functionality
- Smooth slide transitions with Framer Motion
- Progress indicators
- Skip functionality
- Previous/Next navigation
- "Get Started" button on final slide

### AppInitializer.tsx
The main orchestrator component that manages the app initialization flow. Features:
- Shows splash screen first
- Checks if user has completed onboarding
- Shows onboarding carousel for first-time users
- Renders main app content after initialization
- Handles both onboarding completion and skip actions
- Server-side rendering compatible

## Usage

The AppInitializer is integrated into the root layout (`app/layout.tsx`) and wraps all app content:

```tsx
<AppInitializer>
  {children}
</AppInitializer>
```

## Local Storage

Onboarding completion status is tracked in localStorage using the key `calmjournal_onboarding_completed`. See `lib/onboarding.ts` for utility functions.

## Requirements Satisfied

- ✅ 12.1: Gradient splash screen using Calm Blue and Lilac Mist colors
- ✅ 12.3: Soft fade transition animation
- ✅ 12.4: Transition to appropriate screen after initialization
- ✅ 9.1: Onboarding carousel with privacy explanations
- ✅ 9.2: Privacy messaging about local storage and mood tracking
- ✅ 9.3: Onboarding completion tracking (idempotent)
- ✅ 9.4: Skip onboarding functionality
