import React, { useState, useEffect } from 'react';
import { Transaction, AppView } from './types';
import { StorageService } from './services/storage';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { AIInsight } from './components/AIInsight';
import { BottomNav } from './components/BottomNav';
import { Settings } from './components/Settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await StorageService.getAll();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Check system theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddTransaction = async (t: Transaction) => {
    await StorageService.add(t);
    setTransactions(prev => [t, ...prev]);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleDeleteTransaction = async (id: string) => {
    await StorageService.delete(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard transactions={transactions} />;
      case AppView.LIST:
        return <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />;
      case AppView.ADD:
        return <TransactionForm onAdd={handleAddTransaction} onCancel={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.AI_INSIGHTS:
        return <AIInsight transactions={transactions} />;
      case AppView.SETTINGS:
        return <Settings isDark={isDark} toggleTheme={toggleTheme} />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-indigo-500 rounded-xl mb-4"></div>
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto min-h-screen relative bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
         {/* Top SafeArea Simulation for Web */}
         <div className="h-safe-top w-full bg-transparent"></div>
         
         <main className="p-4 pt-6 h-full min-h-screen overflow-y-auto custom-scrollbar">
            {renderContent()}
         </main>

         <BottomNav currentView={currentView} onChangeView={setCurrentView} />
      </div>
    </div>
  );
};

export default App;