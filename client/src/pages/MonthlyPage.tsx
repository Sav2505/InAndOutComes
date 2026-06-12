import { Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { SummaryCards } from '../components/Dashboard/SummaryCards';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency, getExpensesByCategory, getMonthlySummary } from '../utils/finance';

export const MonthlyPage = () => {
  const { transactions, categories, filters } = useFinanceStore();

  const summary = useMemo(
    () => getMonthlySummary(transactions, filters.month),
    [transactions, filters.month],
  );

  const byCategory = useMemo(
    () => getExpensesByCategory(transactions, categories, filters.month),
    [transactions, categories, filters.month],
  );

  return (
    <Stack spacing={2.5}>
      <SummaryCards
        income={summary.totalIncome}
        expenses={summary.totalExpenses}
        balance={summary.remainingBalance}
      />

      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ borderRadius: 4.5 }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={1}>
            פירוט הוצאות לפי קטגוריה
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            כך ניתן לראות בקלות לאן יוצא הכסף במהלך החודש.
          </Typography>

          <Grid container spacing={2}>
            {byCategory.length === 0 ? (
              <Grid size={12}>
                <Typography color="text.secondary">אין הוצאות בחודש שנבחר.</Typography>
              </Grid>
            ) : (
              byCategory.map((entry) => (
                <Grid size={{ xs: 12, md: 6 }} key={entry.name}>
                  <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography fontWeight={700}>{entry.name}</Typography>
                        <Chip label={formatCurrency(entry.value)} sx={{ bgcolor: 'action.hover' }} />
                      </Stack>
                      <Divider />
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        חלק מתוך סך ההוצאות החודשיות:
                        {' '}
                        {summary.totalExpenses > 0
                          ? `${Math.round((entry.value / summary.totalExpenses) * 100)}%`
                          : '0%'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
