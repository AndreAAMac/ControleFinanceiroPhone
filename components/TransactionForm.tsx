import React, { useState } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Icons } from './ui/Icons';

interface TransactionFormProps {
  onAdd: (t: Transaction) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTransaction: Transaction = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      type
    };

    onAdd(newTransaction);
  };

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-10 duration-500">
      <header className="px-1 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Transaction</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Create a new entry</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                type === 'expense' 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface text-slate-400'
            }`}
          >
            <Icons.Expense size={24} className="mb-2" />
            <span className="font-semibold text-sm">Expense</span>
          </button>
          
          <button
            type="button"
            onClick={() => setType('income')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                type === 'income' 
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-surface text-slate-400'
            }`}
          >
            <Icons.Income size={24} className="mb-2" />
            <span className="font-semibold text-sm">Income</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
            
            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                <input 
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Grocery Shopping"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400">$</span>
                    <input 
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>
        </div>

        <div className="flex gap-4 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 rounded-xl font-semibold text-slate-500 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex-1 py-4 rounded-xl font-semibold text-white bg-primary hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
                Save Transaction
            </button>
        </div>

      </form>
    </div>
  );
};