export type TransactionType = 'income' | 'expense';

export type RecurringType = 'monthly' | 'yearly' | 'none';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  isRecurring: boolean;
  recurringType: RecurringType;
  notes?: string;
}
