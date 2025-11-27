'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to prevent race conditions
    const timer = setTimeout(() => {
      if (!loading && !user && !isGuest) {
        router.replace('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isGuest, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-peaceful-accent border-t-transparent rounded-full animate-spin"></div>
          <div className="text-peaceful-text text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user && !isGuest) {
    return (
      <div className="min-h-screen bg-peaceful-bg flex items-center justify-center">
        <div className="text-peaceful-text text-lg">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}