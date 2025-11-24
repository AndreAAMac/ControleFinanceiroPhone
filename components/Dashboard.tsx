import React, { useMemo } from 'react';
import { Transaction, FinancialSummary } from '../types';
import { Icons } from './ui/Icons';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const summary: FinancialSummary = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.totalIncome += t.amount;
        else acc.totalExpense += t.amount;
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  // Prepare chart data for the current month
  const chartData = useMemo(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayTransactions = transactions.filter(t => isSameDay(parseISO(t.date), day));
      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return {
        date: format(day, 'dd'),
        income,
        expense
      };
    });
  }, [transactions]);

  const StatCard = ({ title, value, type }: { title: string, value: number, type: 'income' | 'expense' | 'balance' }) => {
    let colorClass = 'text-slate-900 dark:text-white';
    let Icon = Icons.Balance;
    
    if (type === 'income') {
      colorClass = 'text-emerald-500';
      Icon = Icons.Income;
    } else if (type === 'expense') {
      colorClass = 'text-red-500';
      Icon = Icons.Expense;
    }

    return (
      <div className="bg-white dark:bg-surface p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-start">
        <div className={`p-2 rounded-lg bg-opacity-10 mb-2 ${type === 'income' ? 'bg-emerald-500' : type === 'expense' ? 'bg-red-500' : 'bg-primary'}`}>
           <Icon size={20} className={type === 'income' ? 'text-emerald-500' : type === 'expense' ? 'text-red-500' : 'text-primary'} />
        </div>
        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</span>
        <span className={`text-xl font-bold mt-1 ${colorClass}`}>
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="px-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Overview of your finances</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
            <StatCard title="Total Balance" value={summary.balance} type="balance" />
        </div>
        <StatCard title="Income" value={summary.totalIncome} type="income" />
        <StatCard title="Expenses" value={summary.totalExpense} type="expense" />
      </div>

      <div className="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Activity (This Month)</h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickMargin={10}/>
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};