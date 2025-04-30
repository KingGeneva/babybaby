
// Define sleep log type
export interface SleepLog {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  quality: string;
  notes?: string;
  createdAt: string;
  durationMinutes: number;
  durationDisplay: string;
}

// Local storage key
const SLEEP_LOGS_STORAGE_KEY = 'babybaby-sleep-logs';

// Save sleep log to local storage
export const saveSleepLog = (sleepLog: SleepLog): void => {
  try {
    // Get existing logs
    const existingLogs = getSleepLogs();
    
    // Add new log
    const updatedLogs = [sleepLog, ...existingLogs];
    
    // Save to local storage
    localStorage.setItem(SLEEP_LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Error saving sleep log:', error);
  }
};

// Get all sleep logs from local storage
export const getSleepLogs = (): SleepLog[] => {
  try {
    const logsJson = localStorage.getItem(SLEEP_LOGS_STORAGE_KEY);
    if (!logsJson) return [];
    
    return JSON.parse(logsJson) as SleepLog[];
  } catch (error) {
    console.error('Error retrieving sleep logs:', error);
    return [];
  }
};

// Delete a sleep log
export const deleteSleepLog = (id: string): void => {
  try {
    const logs = getSleepLogs();
    const updatedLogs = logs.filter(log => log.id !== id);
    localStorage.setItem(SLEEP_LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Error deleting sleep log:', error);
  }
};

// Get analytics data
export const getAnalyticsData = () => {
  const logs = getSleepLogs();
  
  if (logs.length === 0) {
    return {
      totalLogs: 0,
      averageDuration: 0,
      qualityDistribution: { good: 0, medium: 0, poor: 0 },
      byDay: {}
    };
  }
  
  // Calculate average duration
  const totalMinutes = logs.reduce((sum, log) => sum + log.durationMinutes, 0);
  const averageDuration = Math.round(totalMinutes / logs.length);
  
  // Calculate quality distribution
  const qualityDistribution = logs.reduce((acc, log) => {
    acc[log.quality] = (acc[log.quality] || 0) + 1;
    return acc;
  }, { good: 0, medium: 0, poor: 0 });
  
  // Group by day
  const byDay = logs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = {
        totalMinutes: 0,
        count: 0,
        logs: []
      };
    }
    
    acc[log.date].totalMinutes += log.durationMinutes;
    acc[log.date].count += 1;
    acc[log.date].logs.push(log);
    
    return acc;
  }, {});
  
  return {
    totalLogs: logs.length,
    averageDuration,
    qualityDistribution,
    byDay
  };
};

// Get latest 7 days of sleep data for charting
export const getWeeklyChartData = () => {
  const logs = getSleepLogs();
  const today = new Date();
  const result = [];
  
  // Create a map for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayLogs = logs.filter(log => log.date === dateString);
    const totalMinutes = dayLogs.reduce((sum, log) => sum + log.durationMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    result.push({
      date: dateString,
      dayName: new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'short' }),
      totalHours: hours + (minutes / 60),
      totalMinutes,
    });
  }
  
  return result;
};
