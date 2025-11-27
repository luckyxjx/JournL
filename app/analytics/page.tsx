'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, PieLabelRenderProps } from 'recharts';
import { AnalyticsEngine } from '@/lib/analytics';
import { useAuth } from '@/lib/auth';

interface MoodData {
  mood: string;
  count: number;
}

interface TrendData {
  date: string;
  count: number;
}

interface EmotionData {
  mood: string;
  count: number;
  percentage: number;
  [key: string]: any;
}

interface FrequencyData {
  [date: string]: number;
}

const COLORS: Record<string, string> = {
  Joy: '#F4B0BD',
  Calm: '#81C4B5', 
  Reflective: '#ECBEDB',
  Sad: '#8C9C92'
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<MoodData[]>([]);
  const [monthlyData, setMonthlyData] = useState<TrendData[]>([]);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [frequencyData, setFrequencyData] = useState<FrequencyData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const loadAnalytics = async () => {
      const analytics = new AnalyticsEngine();
      
      try {
        const [weekly, monthly, emotions, frequency] = await Promise.all([
          analytics.getWeeklyMoodData(user.id),
          analytics.getMonthlyTrend(user.id),
          analytics.getEmotionStats(user.id),
          analytics.getWritingFrequency(user.id)
        ]);
        
        setWeeklyData(weekly);
        setMonthlyData(monthly);
        setEmotionData(emotions);
        setFrequencyData(frequency);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-peaceful-bg p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-peaceful-warm rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-peaceful-warm rounded-3xl"></div>
              <div className="h-64 bg-peaceful-warm rounded-3xl"></div>
              <div className="h-64 bg-peaceful-warm rounded-3xl"></div>
              <div className="h-64 bg-peaceful-warm rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peaceful-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-peaceful-text mb-8">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-serif font-semibold text-peaceful-text mb-4">Weekly Mood Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#81C4B5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-serif font-semibold text-peaceful-text mb-4">Monthly Writing Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#81C4B5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-serif font-semibold text-peaceful-text mb-4">Overall Emotion Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps & { payload?: EmotionData }) => 
                    props.payload ? `${props.payload.mood} ${props.payload.percentage}%` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.mood as keyof typeof COLORS] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-peaceful-warm/80 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-serif font-semibold text-peaceful-text mb-4">Writing Frequency</h2>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Object.entries(frequencyData).slice(-49).map(([date, count]) => (
                <div
                  key={date}
                  className={`w-4 h-4 rounded-sm ${
                    count === 0 ? 'bg-gray-100' :
                    count === 1 ? 'bg-green-200' :
                    count === 2 ? 'bg-green-400' :
                    'bg-green-600'
                  }`}
                  title={`${date}: ${count} entries`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Less</span>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}