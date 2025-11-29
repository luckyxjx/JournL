'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [weeklyReflection, setWeeklyReflection] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setDailyReminder(settings.dailyReminder || false);
      setReminderTime(settings.reminderTime || '20:00');
      setWeeklyReflection(settings.weeklyReflection || false);
    }
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const saveSettings = (newSettings: any) => {
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleDailyReminderToggle = () => {
    const newValue = !dailyReminder;
    setDailyReminder(newValue);
    saveSettings({ dailyReminder: newValue, reminderTime, weeklyReflection });
  };

  const handleTimeChange = (time: string) => {
    setReminderTime(time);
    saveSettings({ dailyReminder, reminderTime: time, weeklyReflection });
  };

  const handleWeeklyToggle = () => {
    const newValue = !weeklyReflection;
    setWeeklyReflection(newValue);
    saveSettings({ dailyReminder, reminderTime, weeklyReflection: newValue });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('JournL Notifications Enabled', {
          body: 'You will now receive writing reminders',
          icon: '/icon.svg'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-peaceful-bg p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-peaceful-text mb-2">Notifications</h1>
          <p className="text-peaceful-text/70">Configure your reminder preferences</p>
        </div>
        
        <button 
          onClick={() => window.history.back()}
          className="fixed top-6 left-6 z-50 w-14 h-14 bg-peaceful-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center backdrop-blur-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-peaceful-warm/90 backdrop-blur-md border border-peaceful rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-peaceful-text mb-4">Daily Reminder</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-peaceful-text">Enable daily writing reminder</p>
                  <p className="text-sm text-peaceful-text/70">Get a gentle reminder to write in your journal</p>
                </div>
                <button
                  onClick={handleDailyReminderToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    dailyReminder ? 'bg-peaceful-accent' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      dailyReminder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {dailyReminder && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-peaceful-text mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-peaceful-text focus:outline-none focus:ring-2 focus:ring-peaceful-accent"
                  />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-peaceful-warm/90 backdrop-blur-md border border-peaceful rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-peaceful-text mb-4">Weekly Reflection</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-peaceful-text">Weekly reflection reminder</p>
                <p className="text-sm text-peaceful-text/70">Get reminded to review your week every Sunday</p>
              </div>
              <button
                onClick={handleWeeklyToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  weeklyReflection ? 'bg-peaceful-accent' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    weeklyReflection ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg text-blue-800 mb-2">Browser Notifications</h3>
            <p className="text-sm text-blue-600 mb-4">
              To receive notifications, you'll need to allow them in your browser settings when prompted.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Status: {notificationPermission === 'granted' ? 'Enabled' : notificationPermission === 'denied' ? 'Blocked' : 'Not Set'}
              </span>
              <button
                onClick={requestNotificationPermission}
                disabled={notificationPermission === 'granted'}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  notificationPermission === 'granted' 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}