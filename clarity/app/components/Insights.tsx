import { insightSummary } from '../insightSummary';
import { streaks } from '../state';
import { shareText, nativeRequest } from '../host';
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { AppShell } from './AppShell';
import { Flame, Heart, Activity, Sparkles, BarChart3, Calendar as CalendarIcon, TrendingUp, BookOpen, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';

type InsightsTab = 'overview' | 'calendar' | 'timeline' | 'journal';

export function Insights() {
  const { checkInHistory, userProfile, reportError } = useApp();
  const { getTextClasses, getSubtextClasses, getCardClasses } = useTheme();
  const [activeTab, setActiveTab] = useState<InsightsTab>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getCurrentStreak = () => streaks(checkInHistory).current;
  const getCheckInStats = () => ({ total: checkInHistory.length, longest: streaks(checkInHistory).longest });

  useEffect(() => {
    const lock = () => { if (document.hidden && userProfile.journalLock) setActiveTab('overview'); };
    document.addEventListener('visibilitychange', lock);
    const nativeLock = () => setActiveTab('overview');
    window.addEventListener('mindrecipe-lock', nativeLock);
    return () => { document.removeEventListener('visibilitychange', lock); window.removeEventListener('mindrecipe-lock', nativeLock); };
  }, [userProfile.journalLock]);

  // Calculate average activation
  const getAvgActivation = () => {
    if (checkInHistory.length === 0) return '—';
    
    let totalActivation = 0;
    let count = 0;
    
    checkInHistory.forEach(entry => {
      if (entry.activation !== undefined) {
        totalActivation += entry.activation;
        count++;
      }
    });
    
    return count > 0 ? (totalActivation / count).toFixed(1) : '—';
  };

  // Get top emotion
  const getTopEmotion = () => {
    const emotionCounts = new Map<string, number>();
    
    checkInHistory.forEach(entry => {
      entry.emotions?.forEach(emotion => {
        emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
      });
    });
    
    if (emotionCounts.size === 0) return { emotion: 'None yet', count: 0 };
    
    const sorted = Array.from(emotionCounts.entries()).sort((a, b) => b[1] - a[1]);
    return { emotion: sorted[0][0], count: sorted[0][1] };
  };

  // Generate Year in Pixels data (last 365 days)
  const generateYearInPixels = () => {
    const pixels: Array<{ date: Date; level: 'low' | 'calm' | 'active' | 'high' | 'none' }> = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Find check-ins for this date
      const checkInsForDate = checkInHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });
      
      let level: 'low' | 'calm' | 'active' | 'high' | 'none' = 'none';
      
      if (checkInsForDate.length > 0) {
        // Use most recent check-in's quadrant
        const quadrant = checkInsForDate[0].compassQuadrant;
        if (quadrant === 'low-protected') level = 'low';
        else if (quadrant === 'low-open') level = 'calm';
        else if (quadrant === 'high-open') level = 'active';
        else if (quadrant === 'high-protected') level = 'high';
        else if (checkInsForDate[0].activation !== undefined) {
          const activation = checkInsForDate[0].activation!;
          level = activation <= 2 ? 'low' : activation <= 5 ? 'calm' : activation <= 7 ? 'active' : 'high';
        }
      }
      
      pixels.push({ date, level });
    }
    
    return pixels;
  };

  // Get check-ins for a specific date
  const getCheckInsForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return checkInHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // Get check-ins for a date range
  const getCheckInsInRange = (daysBack: number) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    return checkInHistory.filter(entry => new Date(entry.timestamp) >= cutoff);
  };

  // Generate timeline chart data
  const getTimelineData = () => {
    const data: Array<{ date: string; activation: number }> = [];
    const sorted = [...checkInHistory].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sorted.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      let activation = entry.activation;
      if (activation === undefined) return;

      data.push({
        date: dateStr,
        activation: activation ?? 5
      });
    });

    return data;
  };

  const currentStreak = getCurrentStreak();
  const checkInStats = getCheckInStats();
  const avgActivation = getAvgActivation();
  const topEmotion = getTopEmotion();
  const yearPixels = generateYearInPixels();
  const timelineData = getTimelineData();

  const handleExportData = async () => {
    try {
      if (userProfile.journalLock && !(await nativeRequest<boolean>('authenticate'))) return;
      await shareText(insightSummary(checkInHistory));
    } catch (error) { reportError(error); }
  };
  const selectTab = async (tab: InsightsTab) => {
    try {
      if (tab === 'journal' && userProfile.journalLock && !(await nativeRequest<boolean>('authenticate'))) return;
      setActiveTab(tab);
    } catch (error) { reportError(error); }
  };
  const tabs = [
    { id: 'overview' as InsightsTab, label: 'Overview', icon: BarChart3 },
    { id: 'calendar' as InsightsTab, label: 'Calendar', icon: CalendarIcon },
    { id: 'timeline' as InsightsTab, label: 'Timeline', icon: TrendingUp },
    { id: 'journal' as InsightsTab, label: 'Journal', icon: BookOpen },
  ];

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const hasCheckInsOnDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return checkInHistory.some(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const selectedDateCheckIns = getCheckInsForDate(selectedDate);
  const thisMonthCheckIns = getCheckInsInRange(30);
  const last7DaysCheckIns = getCheckInsInRange(7);
  const last30DaysCheckIns = getCheckInsInRange(30);

  return (
    <AppShell title="Insights">
      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start justify-between">
          <div>
            <h1 className={`text-3xl mb-2 ${getTextClasses()} transition-colors duration-700`}>
              Insights & Tracking
            </h1>
            <p className={`${getSubtextClasses()} transition-colors duration-700`}>
              Your emotional journey and patterns over time
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all min-h-[44px]"
          >
            <Share2 className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Current Streak */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-4">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="text-4xl font-semibold text-orange-600 dark:text-orange-400 mb-2">
              {currentStreak}
            </div>
            <div className="text-sm text-orange-600/70 dark:text-orange-400/70">
              days in a row
            </div>
          </div>

          {/* Total Check-ins */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Total Check-ins</span>
            </div>
            <div className="text-4xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
              {checkInStats.total}
            </div>
            <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
              Longest: {checkInStats.longest} days
            </div>
          </div>

          {/* Avg Activation */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">Avg Activation</span>
            </div>
            <div className="text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              {avgActivation}<span className="text-2xl">/10</span>
            </div>
            <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
              energy level
            </div>
          </div>

          {/* Top Emotion */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Top Emotion</span>
            </div>
            <div className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
              {topEmotion.emotion}
            </div>
            <div className="text-sm text-green-600/70 dark:text-green-400/70">
              {topEmotion.count} times
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => void selectTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-all min-h-[44px]
                  ${isActive 
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Year in Pixels */}
            <div className={`${getCardClasses()} rounded-2xl p-8 border transition-colors duration-700`}>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-5 h-5 ${getTextClasses()}`} />
                    <h3 className={`text-xl ${getTextClasses()} transition-colors duration-700`}>
                      Year in Pixels
                    </h3>
                  </div>
                  <p className={`text-sm ${getSubtextClasses()} transition-colors duration-700`}>
                    Last 365 days of your emotional journey
                  </p>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Calm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-orange-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
                  </div>
                </div>
              </div>

              {/* Pixel Grid */}
              <div className="overflow-x-auto">
                <div className="inline-flex flex-wrap gap-1 max-w-full" style={{ maxWidth: '900px' }}>
                  {yearPixels.map((pixel, index) => {
                    const colorClass = 
                      pixel.level === 'low' ? 'bg-blue-400 dark:bg-blue-500' :
                      pixel.level === 'calm' ? 'bg-green-400 dark:bg-green-500' :
                      pixel.level === 'active' ? 'bg-orange-400 dark:bg-orange-500' :
                      pixel.level === 'high' ? 'bg-red-400 dark:bg-red-500' :
                      'bg-gray-200 dark:bg-gray-700';
                    
                    return (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${colorClass} transition-all hover:scale-125 cursor-pointer`}
                        title={`${pixel.date.toLocaleDateString()} - ${pixel.level}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Month Labels */}
              <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Oct 2024</span>
                <span>Today</span>
              </div>
            </div>

            {checkInHistory.length === 0 && (
              <div className={`${getCardClasses()} rounded-2xl p-12 text-center border transition-colors duration-700`}>
                <p className={`${getSubtextClasses()} transition-colors duration-700`}>
                  Start checking in to see your patterns over time.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className={`${getCardClasses()} rounded-2xl p-6 border transition-colors duration-700`}>
              {/* Month Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => {
                    const newMonth = new Date(currentMonth);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setCurrentMonth(newMonth);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h3 className={`text-lg ${getTextClasses()}`}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button
                  type="button"
                  onClick={() => {
                    const newMonth = new Date(currentMonth);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setCurrentMonth(newMonth);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                    const days = [];
                    
                    // Empty cells before month starts
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="aspect-square" />);
                    }
                    
                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const isSelected = isSameDay(date, selectedDate);
                      const hasCheckIns = hasCheckInsOnDate(date);
                      const isToday = isSameDay(date, new Date());
                      
                      days.push(
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`
                            aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                            ${isSelected 
                              ? 'bg-purple-500 text-white' 
                              : hasCheckIns 
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }
                            ${isToday && !isSelected ? 'ring-2 ring-purple-400' : ''}
                          `}
                        >
                          {day}
                        </button>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            </div>

            {/* Selected Date Check-ins */}
            <div className={`${getCardClasses()} rounded-2xl p-6 border transition-colors duration-700`}>
              <h3 className={`text-lg ${getTextClasses()} mb-6`}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>

              {selectedDateCheckIns.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateCheckIns.map((entry, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {entry.emotions && entry.emotions.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Emotions:</div>
                          <div className="flex flex-wrap gap-1">
                            {entry.emotions.map((emotion, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {entry.activation !== undefined && (
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Activation: </span>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            {entry.activation}/10
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-12 ${getSubtextClasses()}`}>
                  No check-ins on this date
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Line Chart */}
            {timelineData.length > 0 ? (
              <div className={`${getCardClasses()} rounded-2xl p-8 border transition-colors duration-700`}>
                <h3 className={`text-lg ${getTextClasses()} mb-6`}>
                  Activation Level Over Time
                </h3>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activation" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      name="Activation Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={`${getCardClasses()} rounded-2xl p-12 text-center border transition-colors duration-700`}>
                <p className={`${getSubtextClasses()}`}>
                  No data available for timeline view
                </p>
              </div>
            )}

            {/* Period Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">This Month</div>
                <div className="text-4xl font-semibold text-purple-600 dark:text-purple-400 mb-1">
                  {thisMonthCheckIns.length}
                </div>
                <div className="text-sm text-purple-600/70 dark:text-purple-400/70">check-ins</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">Last 7 Days</div>
                <div className="text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {last7DaysCheckIns.length}
                </div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">check-ins</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-600 dark:text-green-400 mb-2">Last 30 Days</div>
                <div className="text-4xl font-semibold text-green-600 dark:text-green-400 mb-1">
                  {last30DaysCheckIns.length}
                </div>
                <div className="text-sm text-green-600/70 dark:text-green-400/70">check-ins</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-4">
            {checkInHistory.length > 0 ? (
              [...checkInHistory]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((entry, index) => {
                  const date = new Date(entry.timestamp);
                  const activation = entry.activation;
                  const levelLabel = activation !== undefined ? `Level ${activation}` : entry.compassQuadrant?.replaceAll('-', ' ') ?? 'Moment';

                  return (
                    <div 
                      key={index} 
                      className={`${getCardClasses()} rounded-2xl p-6 border-l-4 border-l-purple-500 border transition-colors duration-700`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className={`${getTextClasses()} font-medium`}>
                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className={`text-sm ${getSubtextClasses()}`}>
                            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                          {levelLabel}
                        </Badge>
                      </div>

                      {/* Emotions */}
                      {entry.emotions && entry.emotions.length > 0 && (
                        <div className="mb-4">
                          <div className={`text-sm ${getSubtextClasses()} mb-2`}>Emotions:</div>
                          <div className="flex flex-wrap gap-2">
                            {entry.emotions.map((emotion, i) => (
                              <Badge key={i} variant="secondary" className="bg-gray-600 text-white">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Body Sensations */}
                      {entry.bodyZones && entry.bodyZones.length > 0 && (
                        <div className="mb-4">
                          <div className={`text-sm ${getSubtextClasses()} mb-2`}>Body Sensations:</div>
                          <div className="flex flex-wrap gap-2">
                            {entry.bodyZones.map((sensation, i) => (
                              <Badge key={i} variant="secondary" className="bg-teal-600 text-white">
                                {sensation}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Wellness Connections */}
                      {entry.lifeDomains && entry.lifeDomains.length > 0 && (
                        <div>
                          <div className={`text-sm ${getSubtextClasses()} mb-2`}>Wellness Connections:</div>
                          <div className="flex flex-wrap gap-2">
                            {entry.lifeDomains.map((domain, i) => (
                              <Badge key={i} variant="outline">
                                {domain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {entry.journalEntry && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className={`text-sm ${getSubtextClasses()} mb-1`}>Notes:</div>
                          <p className={`text-sm ${getTextClasses()}`}>{entry.journalEntry}</p>
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              <div className={`${getCardClasses()} rounded-2xl p-12 text-center border transition-colors duration-700`}>
                <p className={`${getSubtextClasses()}`}>
                  No journal entries yet. Start checking in to build your emotional journal.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
