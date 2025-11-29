'use client';

import Dashboard from '@/components/features/Dashboard/Dashboard';
import AuthGuard from '@/components/features/Auth/AuthGuard';

export default function Home() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
