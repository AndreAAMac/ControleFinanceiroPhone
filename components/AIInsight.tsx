import React, { useState } from 'react';
import { Transaction } from '../types';
import { GeminiService } from '../services/gemini';
import { Icons } from './ui/Icons';
import ReactMarkdown from 'react-markdown';

interface AIInsightProps {
  transactions: Transaction[];
}

export const AIInsight: React.FC<AIInsightProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const result = await GeminiService.getFinancialAdvice(transactions);
      setInsight(result);
    } catch (e) {
      setInsight("Failed to load insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icons.AI className="text-primary" /> AI Advisor
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Smart financial analysis powered by Gemini</p>
      </header>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white dark:bg-surface rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <p>Add some transactions to get AI insights!</p>
        </div>
      ) : (
        <>
          {!insight && !loading && (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg">
                <Icons.AI size={48} className="mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Unlock Financial Insights</h3>
                <p className="opacity-90 mb-6 text-sm">Let our AI analyze your spending patterns and provide personalized advice to help you save more.</p>
                <button 
                    onClick={generateInsight}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-50 transition-colors"
                >
                    Analyze My Finances
                </button>
            </div>
          )}

          {loading && (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-slate-500 animate-pulse">Consulting the AI...</p>
             </div>
          )}

          {insight && !loading && (
            <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{insight}</ReactMarkdown>
               </div>
               <button 
                 onClick={generateInsight}
                 className="mt-6 w-full py-3 text-primary text-sm font-medium hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
               >
                 Refresh Analysis
               </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};