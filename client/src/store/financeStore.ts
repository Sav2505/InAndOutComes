import dayjs from 'dayjs';
import { create } from 'zustand';
import type {
  AssetPosition,
  Category,
  Liability,
  Transaction,
  TransactionType,
} from '../types';

type SortBy = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export interface TransactionFilters {
  month: string;
  category: string;
  type: 'all' | TransactionType;
  sortBy: SortBy;
  sortDirection: SortDirection;
}

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  assets: AssetPosition[];
  liabilities: Liability[];
  initialized: boolean;
  loading: boolean;
  filters: TransactionFilters;
  initialize: () => Promise<void>;
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, payload: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addAsset: (payload: Omit<AssetPosition, 'id'>) => Promise<void>;
  updateAsset: (id: string, payload: Omit<AssetPosition, 'id'>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  addLiability: (payload: Omit<Liability, 'id'>) => Promise<void>;
  updateLiability: (id: string, payload: Omit<Liability, 'id'>) => Promise<void>;
  deleteLiability: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
const TRANSACTIONS_URL = `${API_BASE_URL}/transactions`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const ASSETS_URL = `${API_BASE_URL}/assets`;
const LIABILITIES_URL = `${API_BASE_URL}/liabilities`;

const toErrorMessage = (context: string, error: unknown): string => {
  if (error instanceof Error) {
    return `${context}: ${error.message}`;
  }

  return context;
};

const requestJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    throw new Error(
      toErrorMessage('בעיה בגישה לשרת הנתונים. ודא שהרצת npm run dev:full', error),
    );
  }
};

const defaultFilters: TransactionFilters = {
  month: dayjs().format('YYYY-MM'),
  category: 'all',
  type: 'all',
  sortBy: 'date',
  sortDirection: 'desc',
};

const sortTransactions = (
  transactions: Transaction[],
  sortBy: SortBy,
  sortDirection: SortDirection,
): Transaction[] => {
  const sorted = [...transactions].sort((a, b) => {
    if (sortBy === 'amount') {
      return a.amount - b.amount;
    }

    return dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
  });

  return sortDirection === 'desc' ? sorted.reverse() : sorted;
};

const sortAssets = (assets: AssetPosition[]): AssetPosition[] =>
  [...assets].sort((a, b) => b.currentBalance - a.currentBalance);

const sortLiabilities = (liabilities: Liability[]): Liability[] =>
  [...liabilities].sort((a, b) => b.remainingAmount - a.remainingAmount);

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  categories: [],
  assets: [],
  liabilities: [],
  initialized: false,
  loading: false,
  filters: defaultFilters,
  initialize: async () => {
    if (get().initialized) {
      return;
    }

    set({ loading: true });

    try {
      const [transactions, categories, assets, liabilities] = await Promise.all([
        requestJson<Transaction[]>(TRANSACTIONS_URL),
        requestJson<Category[]>(CATEGORIES_URL),
        requestJson<AssetPosition[]>(ASSETS_URL),
        requestJson<Liability[]>(LIABILITIES_URL),
      ]);

      const sortedTransactions = sortTransactions(
        transactions,
        get().filters.sortBy,
        get().filters.sortDirection,
      );

      set({
        transactions: sortedTransactions,
        categories,
        assets: sortAssets(assets),
        liabilities: sortLiabilities(liabilities),
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize finance store from json-server', error);
      set({
        transactions: [],
        categories: [],
        assets: [],
        liabilities: [],
        initialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },
  addTransaction: async (payload) => {
    const nextTransaction: Transaction = {
      ...payload,
      id: crypto.randomUUID(),
    };

    const created = await requestJson<Transaction>(TRANSACTIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextTransaction),
    });

    const next = sortTransactions(
      [...get().transactions, created],
      get().filters.sortBy,
      get().filters.sortDirection,
    );

    set({ transactions: next });
  },
  updateTransaction: async (id, payload) => {
    const updatedTransaction: Transaction = { ...payload, id };

    await requestJson<Transaction>(`${TRANSACTIONS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction),
    });

    const next = sortTransactions(
      get().transactions.map((transaction) =>
        transaction.id === id ? updatedTransaction : transaction,
      ),
      get().filters.sortBy,
      get().filters.sortDirection,
    );

    set({ transactions: next });
  },
  deleteTransaction: async (id) => {
    await requestJson<Record<string, never>>(`${TRANSACTIONS_URL}/${id}`, {
      method: 'DELETE',
    });

    const next = get().transactions.filter((transaction) => transaction.id !== id);
    set({ transactions: next });
  },
  addAsset: async (payload) => {
    const created = await requestJson<AssetPosition>(ASSETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, id: crypto.randomUUID() }),
    });

    set({ assets: sortAssets([...get().assets, created]) });
  },
  updateAsset: async (id, payload) => {
    const updatedAsset: AssetPosition = { ...payload, id };

    await requestJson<AssetPosition>(`${ASSETS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAsset),
    });

    set({
      assets: sortAssets(
        get().assets.map((asset) => (asset.id === id ? updatedAsset : asset)),
      ),
    });
  },
  deleteAsset: async (id) => {
    await requestJson<Record<string, never>>(`${ASSETS_URL}/${id}`, {
      method: 'DELETE',
    });

    set({ assets: get().assets.filter((asset) => asset.id !== id) });
  },
  addLiability: async (payload) => {
    const created = await requestJson<Liability>(LIABILITIES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, id: crypto.randomUUID() }),
    });

    set({ liabilities: sortLiabilities([...get().liabilities, created]) });
  },
  updateLiability: async (id, payload) => {
    const updatedLiability: Liability = { ...payload, id };

    await requestJson<Liability>(`${LIABILITIES_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLiability),
    });

    set({
      liabilities: sortLiabilities(
        get().liabilities.map((liability) =>
          liability.id === id ? updatedLiability : liability,
        ),
      ),
    });
  },
  deleteLiability: async (id) => {
    await requestJson<Record<string, never>>(`${LIABILITIES_URL}/${id}`, {
      method: 'DELETE',
    });

    set({ liabilities: get().liabilities.filter((liability) => liability.id !== id) });
  },
  setFilters: (filters) => {
    const nextFilters = { ...get().filters, ...filters };
    const nextTransactions = sortTransactions(
      get().transactions,
      nextFilters.sortBy,
      nextFilters.sortDirection,
    );

    set({ filters: nextFilters, transactions: nextTransactions });
  },
  resetFilters: () => {
    const nextTransactions = sortTransactions(
      get().transactions,
      defaultFilters.sortBy,
      defaultFilters.sortDirection,
    );

    set({ filters: defaultFilters, transactions: nextTransactions });
  },
}));
