import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, Clock } from 'lucide-react';
import { DailyReport } from '../types';
import { formatDuration, formatDate, getWeekDates } from '../utils/timeUtils';

interface ReportsProps {
  dailyReports: DailyReport[];
  isDark: boolean;
}

export default function Reports({ dailyReports, isDark }: ReportsProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const weekDates = getWeekDates();
  const reportsMap = new Map(dailyReports.map(report => [report.date, report]));
  
  const selectedReport = selectedDate ? reportsMap.get(selectedDate) : null;
  const todayReport = reportsMap.get(weekDates[weekDates.length - 1]);

  // Calculate week totals
  const weekTotals = dailyReports
    .filter(report => weekDates.includes(report.date))
    .reduce((acc, report) => {
      report.tasks.forEach(task => {
        if (acc[task.taskName]) {
          acc[task.taskName] += task.totalTime;
        } else {
          acc[task.taskName] = task.totalTime;
        }
      });
      return acc;
    }, {} as Record<string, number>);

  const weekTotal = Object.values(weekTotals).reduce((sum, time) => sum + time, 0);
  const maxWeekTime = Math.max(...Object.values(weekTotals), 1);

  // Calculate daily totals for the week chart
  const dailyTotals = weekDates.map(date => {
    const report = reportsMap.get(date);
    return {
      date,
      total: report?.totalTime || 0
    };
  });

  const maxDailyTime = Math.max(...dailyTotals.map(d => d.total), 1);

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors duration-200`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Reportes
        </h2>
      </div>

      {/* Today's Summary */}
      {todayReport && (
        <div className={`mb-6 p-4 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-blue-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-500" />
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Resumen de Hoy
            </h3>
          </div>
          <p className={`text-2xl font-bold text-blue-600 mb-1`}>
            {formatDuration(todayReport.totalTime)}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {todayReport.tasks.length} tareas trabajadas
          </p>
        </div>
      )}

      {/* Week Overview */}
      <div className="mb-6">
        <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Última Semana
        </h3>
        
        {/* Weekly Bar Chart */}
        <div className="mb-4">
          <div className="flex items-end justify-between h-32 gap-1">
            {dailyTotals.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t transition-all duration-300 cursor-pointer ${
                    selectedDate === day.date ? 'bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  style={{ 
                    height: `${(day.total / maxDailyTime) * 100}%`,
                    minHeight: day.total > 0 ? '4px' : '2px'
                  }}
                  onClick={() => setSelectedDate(selectedDate === day.date ? null : day.date)}
                  title={`${formatDate(day.date)}: ${formatDuration(day.total)}`}
                />
                <span className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(day.date).slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Week Totals by Task */}
        {Object.keys(weekTotals).length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Total semanal por tarea:
            </h4>
            {Object.entries(weekTotals)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([taskName, time]) => (
                <div key={taskName} className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {taskName}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 rounded-full bg-blue-500`} 
                         style={{ width: `${(time / maxWeekTime) * 60}px` }} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {formatDuration(time)}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Selected Day Detail */}
      {selectedReport && (
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-blue-500" />
            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {formatDate(selectedReport.date)}
            </h4>
          </div>
          
          <div className="space-y-2">
            {selectedReport.tasks
              .sort((a, b) => b.totalTime - a.totalTime)
              .map((task, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: task.color }} 
                    />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {task.taskName}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {formatDuration(task.totalTime)}
                  </span>
                </div>
              ))
            }
            
            <div className={`pt-2 mt-2 border-t ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Total
                  </span>
                </div>
                <span className={`text-sm font-bold text-blue-600`}>
                  {formatDuration(selectedReport.totalTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {dailyReports.length === 0 && (
        <div className={`text-center py-8 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <BarChart3 size={48} className="mx-auto mb-3 opacity-50" />
          <p>No hay datos para mostrar</p>
          <p className="text-sm">Comienza a trabajar en tus tareas para ver reportes</p>
        </div>
      )}
    </div>
  );
}