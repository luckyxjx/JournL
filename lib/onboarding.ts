/**
 * Onboarding state management using local storage
 */

const ONBOARDING_KEY = 'calmjournal_onboarding_completed';

/**
 * Check if the user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error reading onboarding status:', error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export function setOnboardingCompleted(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
}

/**
 * Reset onboarding status (useful for testing)
 */
export function resetOnboarding(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
}
