import { useEffect, useCallback } from 'react';

export function usePerformance() {
  // Optimize animations based on device capabilities
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Debounce function for performance-critical operations
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Throttle function for scroll/resize events
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Optimize images for performance
  const optimizeImage = useCallback((file: File, maxWidth = 1920, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Memory cleanup
  useEffect(() => {
    return () => {
      // Cleanup any pending timeouts or intervals
      if (typeof window !== 'undefined') {
        // Force garbage collection if available (dev only)
        if ('gc' in window && typeof window.gc === 'function') {
          window.gc();
        }
      }
    };
  }, []);

  return {
    prefersReducedMotion,
    debounce,
    throttle,
    optimizeImage
  };
}