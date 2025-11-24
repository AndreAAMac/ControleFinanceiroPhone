import { Transaction } from '../types';

const STORAGE_KEY = 'expofinance_transactions';

// Helper to simulate async behavior like SQLite
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  async getAll(): Promise<Transaction[]> {
    await delay(100); // Simulate DB latency
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async add(transaction: Transaction): Promise<void> {
    await delay(100);
    const current = await this.getAll();
    const updated = [transaction, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async update(updatedTransaction: Transaction): Promise<void> {
    await delay(100);
    const current = await this.getAll();
    const index = current.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      current[index] = updatedTransaction;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  },

  async delete(id: string): Promise<void> {
    await delay(100);
    const current = await this.getAll();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async exportData(): Promise<string> {
    const data = await this.getAll();
    return JSON.stringify(data, null, 2);
  },

  async clearAll(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
};