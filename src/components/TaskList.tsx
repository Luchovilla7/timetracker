import React, { useState } from 'react';
import { Task } from '../types';
import { Play, Pause, Square, Edit3, Trash2, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  timerStatus: 'stopped' | 'running' | 'paused';
  onTaskSelect: (taskId: string) => void;
  onTaskCreate: (name: string) => void;
  onTaskUpdate: (taskId: string, name: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTimerStart: () => void;
  onTimerPause: () => void;
  onTimerStop: () => void;
  isDark: boolean;
}

export default function TaskList({
  tasks,
  activeTaskId,
  timerStatus,
  onTaskSelect,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTimerStart,
  onTimerPause,
  onTimerStop,
  isDark
}: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingName(task.name);
  };

  const handleEditSave = () => {
    if (editingTaskId && editingName.trim()) {
      onTaskUpdate(editingTaskId, editingName.trim());
    }
    setEditingTaskId(null);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditingName('');
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onTaskCreate(newTaskName.trim());
      setNewTaskName('');
      setShowAddTask(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'edit' | 'add') => {
    if (e.key === 'Enter') {
      if (action === 'edit') {
        handleEditSave();
      } else {
        handleAddTask();
      }
    } else if (e.key === 'Escape') {
      if (action === 'edit') {
        handleEditCancel();
      } else {
        setShowAddTask(false);
        setNewTaskName('');
      }
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors duration-200`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Tareas
        </h2>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          <Plus size={16} />
          Nueva
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              activeTaskId === task.id
                ? 'border-blue-500 shadow-md'
                : isDark
                ? 'border-gray-600 hover:border-gray-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: task.color }}
                />
                
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, 'edit')}
                    onBlur={handleEditSave}
                    className={`flex-1 px-2 py-1 rounded border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 cursor-pointer font-medium ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}
                    onClick={() => onTaskSelect(task.id)}
                  >
                    {task.name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeTaskId === task.id && (
                  <div className="flex gap-1 mr-2">
                    {timerStatus === 'running' ? (
                      <>
                        <button
                          onClick={onTimerPause}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-200"
                          title="Pausar"
                        >
                          <Pause size={16} />
                        </button>
                        <button
                          onClick={onTimerStop}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                          title="Detener"
                        >
                          <Square size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={onTimerStart}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                        title="Iniciar"
                      >
                        <Play size={16} />
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleEditStart(task)}
                  className={`p-2 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } rounded-lg transition-colors duration-200`}
                  title="Editar"
                >
                  <Edit3 size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                </button>
                
                <button
                  onClick={() => onTaskDelete(task.id)}
                  className={`p-2 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } rounded-lg transition-colors duration-200`}
                  title="Eliminar"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {showAddTask && (
          <div className={`p-4 rounded-lg border-2 border-dashed ${
            isDark ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'add')}
              placeholder="Nombre de la nueva tarea..."
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskName('');
                }}
                className={`px-3 py-1 rounded ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                } transition-colors duration-200`}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTask}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
              >
                Agregar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}