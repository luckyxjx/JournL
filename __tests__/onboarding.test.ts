import { describe, it, expect } from 'vitest';
import {
  hasCompletedOnboarding,
  setOnboardingCompleted,
  resetOnboarding,
} from '@/lib/onboarding';

describe('Onboarding', () => {
  it('should return false when onboarding has not been completed', () => {
    expect(hasCompletedOnboarding()).toBe(false);
  });

  it('should return true after onboarding is marked as completed', () => {
    setOnboardingCompleted();
    expect(hasCompletedOnboarding()).toBe(true);
  });

  it('should persist onboarding completion across checks', () => {
    setOnboardingCompleted();
    expect(hasCompletedOnboarding()).toBe(true);
    expect(hasCompletedOnboarding()).toBe(true);
    expect(hasCompletedOnboarding()).toBe(true);
  });

  it('should reset onboarding status', () => {
    setOnboardingCompleted();
    expect(hasCompletedOnboarding()).toBe(true);
    
    resetOnboarding();
    expect(hasCompletedOnboarding()).toBe(false);
  });

  it('should handle multiple completions idempotently', () => {
    setOnboardingCompleted();
    setOnboardingCompleted();
    setOnboardingCompleted();
    expect(hasCompletedOnboarding()).toBe(true);
  });
});
