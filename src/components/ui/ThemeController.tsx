import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeController: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'auto', label: 'Auto', icon: '🌓' },
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
    { value: 'corporate', label: 'Corporate', icon: '💼' },
  ] as const;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <span className="text-xl">
          {themes.find(t => t.value === theme)?.icon || '🌓'}
        </span>
      </div>
      <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <div className="menu-title">
          <span>Theme</span>
        </div>
        {themes.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`menu-item ${theme === value ? 'active' : ''}`}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
