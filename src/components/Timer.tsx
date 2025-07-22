import React from 'react';
import { Clock, Calendar, Activity } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';

interface TimerProps {
  currentTime: number;
  timerStatus: 'stopped' | 'running' | 'paused';
  activeTaskName: string | null;
  isDark: boolean;
}

export default function Timer({ currentTime, timerStatus, activeTaskName, isDark }: TimerProps) {
  const getStatusColor = () => {
    switch (timerStatus) {
      case 'running':
        return 'text-green-500';
      case 'paused':
        return 'text-yellow-500';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (timerStatus) {
      case 'running':
        return 'En ejecución';
      case 'paused':
        return 'Pausado';
      default:
        return 'Detenido';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg text-center transition-colors duration-200`}>
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock size={24} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Cronómetro
          </h2>
        </div>
        
        {activeTaskName && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <Activity size={16} className="text-blue-500" />
            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {activeTaskName}
            </span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className={`text-6xl font-mono font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {formatTime(currentTime)}
        </div>
        
        <div className={`flex items-center justify-center gap-2 ${getStatusColor()}`}>
          <div className={`w-2 h-2 rounded-full ${
            timerStatus === 'running' ? 'bg-green-500 animate-pulse' : 
            timerStatus === 'paused' ? 'bg-yellow-500' : 
            isDark ? 'bg-gray-400' : 'bg-gray-500'
          }`} />
          <span className="font-medium">{getStatusText()}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {!activeTaskName && (
        <div className={`mt-4 p-3 rounded-lg ${
          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
        }`}>
          Selecciona una tarea para comenzar a medir el tiempo
        </div>
      )}
    </div>
  );
}