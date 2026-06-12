import { Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  TransactionFormModal,
  type TransactionFormValues,
} from '../components/Forms/TransactionFormModal';
import { TransactionFilters } from '../components/Transactions/TransactionFilters';
import { TransactionList } from '../components/Transactions/TransactionList';
import dayjs from 'dayjs';
import { useFinanceStore } from '../store/financeStore';
import type { Transaction } from '../types';
import { transactionAppliesToMonth } from '../utils/finance';

export const TransactionsPage = () => {
  const {
    transactions,
    categories,
    filters,
    setFilters,
    resetFilters,
    updateTransaction,
    deleteTransaction,
  } = useFinanceStore();

  const [editTarget, setEditTarget] = useState<Transaction | undefined>();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchMonth = transactionAppliesToMonth(transaction, dayjs(filters.month));
      const matchType = filters.type === 'all' || transaction.type === filters.type;
      const matchCategory =
        filters.category === 'all' || transaction.category === filters.category;

      return matchMonth && matchType && matchCategory;
    });
  }, [transactions, filters]);

  const closeEditModal = () => setEditTarget(undefined);

  const handleEdit = async (payload: TransactionFormValues) => {
    if (!editTarget) {
      return;
    }

    try {
      await updateTransaction(editTarget.id, payload);
      closeEditModal();
    } catch (error) {
      console.error('Failed to update transaction', error);
    }
  };

  return (
    <Stack spacing={2}>
      <TransactionFilters
        filters={filters}
        categories={categories}
        onChange={(next) => setFilters(next)}
        onReset={resetFilters}
      />

      <TransactionList
        transactions={filteredTransactions}
        categories={categories}
        onDelete={(id) => {
          void deleteTransaction(id);
        }}
        onEdit={setEditTarget}
      />

      <TransactionFormModal
        open={Boolean(editTarget)}
        categories={categories}
        editTarget={editTarget}
        onClose={closeEditModal}
        onSubmit={handleEdit}
      />
    </Stack>
  );
};
