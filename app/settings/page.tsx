'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { signOut, user, isGuest } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  const settingsOptions = [
    {
      title: 'Theme',
      description: 'Customize your app appearance',
      href: '/settings/theme',
      icon: ThemeIcon,
    },
    {
      title: 'Privacy',
      description: 'Manage your data and privacy settings',
      href: '/settings/privacy',
      icon: PrivacyIcon,
    },
    {
      title: 'Notifications',
      description: 'Configure reminder settings',
      href: '/settings/notifications',
      icon: NotificationIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-peaceful-bg p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">Settings</h1>
          <p className="text-peaceful-text/70">Customize your journL experience</p>
        </div>
        
        {/* FAB Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="fixed top-6 left-6 z-50 w-14 h-14 bg-peaceful-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="space-y-4">
          {settingsOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={option.href}>
                <div className="bg-peaceful-warm/90 backdrop-blur-md border border-peaceful rounded-2xl p-6 hover:bg-peaceful-warm transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-peaceful-accent/10 rounded-xl flex items-center justify-center group-hover:bg-peaceful-accent/20 transition-colors">
                      <option.icon className="w-6 h-6 text-peaceful-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-peaceful-text">{option.title}</h3>
                      <p className="text-peaceful-text/70">{option.description}</p>
                    </div>
                    <svg className="w-5 h-5 text-peaceful-text/40 group-hover:text-peaceful-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {(user || isGuest) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: settingsOptions.length * 0.1 }}
            >
              <button
                onClick={handleSignOut}
                className="w-full bg-red-50 border border-red-200 rounded-2xl p-6 hover:bg-red-100 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg text-red-800">Sign Out</h3>
                    <p className="text-red-600">{isGuest ? 'Exit guest mode' : 'Sign out of your account'}</p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThemeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
    </svg>
  );
}

function PrivacyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function NotificationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.718A8.966 8.966 0 0112 16a8.966 8.966 0 017.132 3.718M6.343 6.343L4.93 4.93m12.728 1.414L19.07 4.93M12 2v2m0 16v2" />
    </svg>
  );
}