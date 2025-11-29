import { lazy } from 'react';

// Lazy load heavy components to improve initial bundle size
export const LazyEntryEditor = lazy(() => import('./features/Journal/EntryEditor'));
export const LazyPhotoAttachment = lazy(() => import('./features/Journal/PhotoAttachment'));
export const LazyOnboardingCarousel = lazy(() => import('./OnboardingCarousel'));

// Loading fallback component
export function ComponentLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-peaceful-accent border-t-transparent"></div>
    </div>
  );
}