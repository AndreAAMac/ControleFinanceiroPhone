export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // ISO string
  type: TransactionType;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LIST = 'LIST',
  ADD = 'ADD',
  AI_INSIGHTS = 'AI_INSIGHTS',
  SETTINGS = 'SETTINGS'
}

export const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Salary', 'Investment', 'Other'
];