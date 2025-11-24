import React from 'react';
import { AppView } from '../types';
import { Icons } from './ui/Icons';

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Icons.Dashboard, label: 'Home' },
    { view: AppView.LIST, icon: Icons.List, label: 'History' },
    { view: AppView.ADD, icon: Icons.Add, label: 'Add', highlight: true },
    { view: AppView.AI_INSIGHTS, icon: Icons.AI, label: 'Advisor' },
    { view: AppView.SETTINGS, icon: Icons.Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface border-t border-slate-200 dark:border-slate-700 pb-safe pt-2 px-4 shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-between items-center h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
              <button
                key={item.view}
                onClick={() => onChangeView(item.view)}
                className="relative -top-6 bg-primary hover:bg-indigo-600 text-white p-4 rounded-full shadow-xl transition-transform active:scale-95"
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center justify-center space-y-1 w-12 transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};