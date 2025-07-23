import React, { useState, useEffect } from 'react';
import { Task, TimeEntry, DailyReport, ThemeMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTimer } from './hooks/useTimer';
import { getTodayString, generateTaskColors } from './utils/timeUtils';
import TaskList from './components/TaskList';
import Timer from './components/Timer';
import Reports from './components/Reports';
import ThemeToggle from './components/ThemeToggle';
import { Timer as TimerIcon } from 'lucide-react';

const DEFAULT_TASKS: Omit<Task, 'id'>[] = [
  { name: 'Crear contenido', color: '#3B82F6', isActive: false, totalTime: 0 },
  { name: 'Grabar videos', color: '#10B981', isActive: false, totalTime: 0 },
  { name: 'Editar videos', color: '#F59E0B', isActive: false, totalTime: 0 },
  { name: 'Escribir guiones de contenido', color: '#EF4444', isActive: false, totalTime: 0 },
  { name: 'Fada Fungi', color: '#8B5CF6', isActive: false, totalTime: 0 },
  { name: 'Óptica Gunther', color: '#06B6D4', isActive: false, totalTime: 0 },
  { name: 'DIVIA', color: '#84CC16', isActive: false, totalTime: 0 },
  { name: 'Estudiar', color: '#F97316', isActive: false, totalTime: 0 },
  { name: 'Mi negocio', color: '#EC4899', isActive: false, totalTime: 0 },
];

function App() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'light');
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', 
    DEFAULT_TASKS.map((task, index) => ({ ...task, id: `task-${index}` }))
  );
  const [timeEntries, setTimeEntries] = useLocalStorage<TimeEntry[]>('timeEntries', []);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [dailyReports, setDailyReports] = useLocalStorage<DailyReport[]>('dailyReports', []);

  const { seconds, status, start, pause, stop } = useTimer();

  const isDark = theme === 'dark';

  // Update body class for theme
  useEffect(() => {
    document.body.className = isDark ? 'bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen';
  }, [isDark]);

  // Calculate daily reports from time entries
  useEffect(() => {
    const reportsByDate = new Map<string, DailyReport>();

    timeEntries.forEach(entry => {
      if (!reportsByDate.has(entry.date)) {
        reportsByDate.set(entry.date, {
          date: entry.date,
          tasks: [],
          totalTime: 0
        });
      }

      const report = reportsByDate.get(entry.date)!;
      const existingTask = report.tasks.find(t => t.taskId === entry.taskId);

      if (existingTask) {
        existingTask.totalTime += entry.duration;
      } else {
        const task = tasks.find(t => t.id === entry.taskId);
        report.tasks.push({
          taskId: entry.taskId,
          taskName: entry.taskName,
          totalTime: entry.duration,
          color: task?.color || '#3B82F6'
        });
      }

      report.totalTime += entry.duration;
    });

    setDailyReports(Array.from(reportsByDate.values()));
  }, [timeEntries, tasks, setDailyReports]);

  const handleTaskSelect = (taskId: string) => {
    if (status !== 'stopped') {
      handleTimerStop();
    }
    setActiveTaskId(taskId);
    
    setTasks(current =>
      current.map(task => ({
        ...task,
        isActive: task.id === taskId
      }))
    );
  };

  const handleTaskCreate = (name: string) => {
    const colors = generateTaskColors();
    const usedColors = tasks.map(t => t.color);
    const availableColor = colors.find(color => !usedColors.includes(color)) || colors[0];
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name,
      color: availableColor,
      isActive: false,
      totalTime: 0
    };

    setTasks(current => [...current, newTask]);
  };

  const handleTaskUpdate = (taskId: string, name: string) => {
    setTasks(current =>
      current.map(task =>
        task.id === taskId ? { ...task, name } : task
      )
    );
  };

  const handleTaskDelete = (taskId: string) => {
    if (activeTaskId === taskId) {
      handleTimerStop();
      setActiveTaskId(null);
    }
    
    setTasks(current => current.filter(task => task.id !== taskId));
  };

  const handleTimerStart = () => {
    if (!activeTaskId) return;
    start();
  };

  const handleTimerPause = () => {
    pause();
  };

  const handleTimerStop = () => {
    if (!activeTaskId || status === 'stopped') return;

    const result = stop();
    
    if (result.wasRunning && result.duration >= 0) {
      const activeTask = tasks.find(t => t.id === activeTaskId);
      if (activeTask) {
        const newEntry: TimeEntry = {
          taskId: activeTaskId,
          taskName: activeTask.name,
          startTime: result.startTime || Date.now() - (result.duration * 1000),
          endTime: result.endTime,
          duration: result.duration,
          date: getTodayString()
        };

        setTimeEntries(current => [...current, newEntry]);
        
        // Update task total time
        setTasks(current =>
          current.map(task =>
            task.id === activeTaskId
              ? { ...task, totalTime: task.totalTime + result.duration }
              : task
          )
        );
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const activeTask = tasks.find(task => task.id === activeTaskId);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TimerIcon size={32} className="text-blue-500" />
            <h1 className={`text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              TimeTracker Pro
            </h1>
          </div>
          
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-1">
            <TaskList
              tasks={tasks}
              activeTaskId={activeTaskId}
              timerStatus={status}
              onTaskSelect={handleTaskSelect}
              onTaskCreate={handleTaskCreate}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTimerStart={handleTimerStart}
              onTimerPause={handleTimerPause}
              onTimerStop={handleTimerStop}
              isDark={isDark}
            />
          </div>

          {/* Middle Column - Timer */}
          <div className="lg:col-span-1">
            <Timer
              currentTime={seconds}
              timerStatus={status}
              activeTaskName={activeTask?.name || null}
              isDark={isDark}
            />
          </div>

          {/* Right Column - Reports */}
          <div className="lg:col-span-1">
            <Reports
              dailyReports={dailyReports}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-12 text-center text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p>TimeTracker Pro - Gestiona tu tiempo como un profesional</p>
        </footer>
      </div>
    </div>
  );
}

export default App;