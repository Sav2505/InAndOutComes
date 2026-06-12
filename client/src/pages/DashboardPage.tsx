import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ExpensesPieChart } from '../components/Charts/ExpensesPieChart';
import { IncomeExpenseBarChart } from '../components/Charts/IncomeExpenseBarChart';
import { MonthlyTrendChart } from '../components/Charts/MonthlyTrendChart';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { useFinanceStore } from '../store/financeStore';
import { getExpensesByCategory, getMonthlySummary, getMonthlyTrend } from '../utils/finance';

export const DashboardPage = () => {
  const { transactions, categories, filters } = useFinanceStore();

  const summary = useMemo(
    () => getMonthlySummary(transactions, filters.month),
    [transactions, filters.month],
  );

  const expenseCategoryData = useMemo(
    () => getExpensesByCategory(transactions, categories, filters.month),
    [transactions, categories, filters.month],
  );

  const trendData = useMemo(() => getMonthlyTrend(transactions), [transactions]);

  const recentTransactions = useMemo(
    () => [...transactions].slice(0, 6),
    [transactions],
  );

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <SummaryCards
          income={summary.totalIncome}
          expenses={summary.totalExpenses}
          balance={summary.remainingBalance}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <ExpensesPieChart data={expenseCategoryData} />
        </motion.div>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <IncomeExpenseBarChart
            totalIncome={summary.totalIncome}
            totalExpenses={summary.totalExpenses}
          />
        </motion.div>
      </Grid>

      <Grid size={12}>
        <MonthlyTrendChart data={trendData} />
      </Grid>

      <Grid size={12}>
        <RecentActivity transactions={recentTransactions} />
      </Grid>
    </Grid>
  );
};
