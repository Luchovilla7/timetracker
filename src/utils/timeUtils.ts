export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const getWeekDates = (): string[] => {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    dates.push(getDateString(i));
  }
  return dates;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateString === today.toISOString().split('T')[0]) {
    return 'Hoy';
  }
  if (dateString === yesterday.toISOString().split('T')[0]) {
    return 'Ayer';
  }
  
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const generateTaskColors = (): string[] => [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];