import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';
import { Icons } from './ui/Icons';
import { format, parseISO } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      return matchesType && matchesCategory;
    });
  }, [transactions, filterType, filterCategory]);

  return (
    <div className="space-y-4 pb-24 h-full flex flex-col">
      <header className="px-1 flex justify-between items-end mb-2">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">History details</p>
        </div>
        <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-1 flex text-xs font-medium">
             <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-md transition-all ${filterType === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
             >All</button>
             <button 
                onClick={() => setFilterType('income')}
                className={`px-3 py-1 rounded-md transition-all ${filterType === 'income' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`}
             >In</button>
             <button 
                onClick={() => setFilterType('expense')}
                className={`px-3 py-1 rounded-md transition-all ${filterType === 'expense' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-500' : 'text-slate-500 dark:text-slate-400'}`}
             >Out</button>
        </div>
      </header>

      {/* Category Filter Scroll */}
      <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar px-1">
        <button
           onClick={() => setFilterCategory('All')}
           className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterCategory === 'All' ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' : 'bg-transparent text-slate-600 border-slate-300 dark:text-slate-400 dark:border-slate-700'}`}
        >
            All
        </button>
        {CATEGORIES.map(cat => (
             <button
             key={cat}
             onClick={() => setFilterCategory(cat)}
             className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${filterCategory === cat ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' : 'bg-transparent text-slate-600 border-slate-300 dark:text-slate-400 dark:border-slate-700'}`}
          >
              {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {filteredTransactions.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
                <Icons.List size={48} className="mx-auto mb-4 opacity-20" />
                <p>No transactions found.</p>
            </div>
        ) : (
            filteredTransactions.map(t => (
                <div key={t.id} className="group bg-white dark:bg-surface p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-all hover:scale-[1.01]">
                    <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                             {t.type === 'income' ? <Icons.Income size={18} /> : <Icons.Expense size={18} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{t.title}</h3>
                            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                                <span>{t.category}</span>
                                <span>•</span>
                                <span>{format(parseISO(t.date), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                         </span>
                         <button 
                            onClick={() => onDelete(t.id)}
                            className="mt-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                             <Icons.Delete size={14} />
                         </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};