export interface Task {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  totalTime: number; // in seconds
}

export interface TimeEntry {
  taskId: string;
  taskName: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  date: string; // YYYY-MM-DD format
}

export interface DailyReport {
  date: string;
  tasks: {
    taskId: string;
    taskName: string;
    totalTime: number;
    color: string;
  }[];
  totalTime: number;
}

export type TimerStatus = 'stopped' | 'running' | 'paused';

export type ThemeMode = 'light' | 'dark';