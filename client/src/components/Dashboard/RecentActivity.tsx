import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import type { Transaction } from '../../types';
import { formatCurrency } from '../../utils/finance';

interface RecentActivityProps {
  transactions: Transaction[];
}

export const RecentActivity = ({ transactions }: RecentActivityProps) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ borderRadius: 4.5 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2.5}>
          פעילות אחרונה
        </Typography>

        <Stack divider={<Divider flexItem />} spacing={0.6}>
          {transactions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              עדיין אין תנועות.
            </Typography>
          ) : (
            transactions.map((transaction, index) => (
              <Stack
                component={motion.div}
                key={transaction.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                py={1.5}
                spacing={1}
                sx={{
                  px: 1,
                  borderRadius: 2.5,
                  transition: 'background-color 180ms ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Stack>
                  <Typography fontWeight={600}>{transaction.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(transaction.date).format('DD/MM/YYYY')} • {transaction.category}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  {transaction.isRecurring && (
                    <Chip
                      icon={<AutorenewRoundedIcon />}
                      label={transaction.recurringType === 'monthly' ? 'חודשי' : 'שנתי'}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Typography
                    fontWeight={700}
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </Typography>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
