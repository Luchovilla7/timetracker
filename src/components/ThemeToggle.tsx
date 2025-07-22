import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-xl transition-all duration-200 ${
        isDark 
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
          : 'bg-white text-gray-600 hover:bg-gray-50 shadow-lg'
      }`}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}