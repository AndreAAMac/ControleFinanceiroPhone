import React from 'react';
import { Icons } from './ui/Icons';
import { StorageService } from '../services/storage';

interface SettingsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDark, toggleTheme }) => {
  const handleExport = async () => {
    const data = await StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_backup_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClearData = async () => {
    if (confirm("Are you sure? This will delete all transactions permanently.")) {
      await StorageService.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">App preferences</p>
      </header>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-surface p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                    {isDark ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
            </div>
            <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-slate-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        </div>

        {/* Export */}
        <button 
            onClick={handleExport}
            className="w-full bg-white dark:bg-surface p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
        >
             <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <Icons.Export size={20} />
             </div>
             <div>
                <span className="block font-medium text-slate-700 dark:text-slate-200">Export Data</span>
                <span className="text-xs text-slate-500">Download JSON backup</span>
             </div>
        </button>

        {/* Clear Data */}
        <button 
            onClick={handleClearData}
            className="w-full bg-white dark:bg-surface p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group"
        >
             <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 group-hover:bg-red-200">
                <Icons.Delete size={20} />
             </div>
             <div>
                <span className="block font-medium text-red-600 dark:text-red-400">Clear All Data</span>
                <span className="text-xs text-red-400">Permanently remove transactions</span>
             </div>
        </button>
      </div>
      
      <div className="text-center text-xs text-slate-400 pt-8">
        <p>ExpoFinance Web v1.0.0</p>
        <p>Offline Capable • Local Storage</p>
      </div>
    </div>
  );
};