import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import type { Category, Transaction } from '../../types';
import { formatCurrency } from '../../utils/finance';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <Stack spacing={2}>
      {transactions.length === 0 ? (
        <Card sx={{ borderRadius: 4.5 }}>
          <CardContent>
            <Typography color="text.secondary">לא נמצאו תנועות לפי הסינון שנבחר.</Typography>
          </CardContent>
        </Card>
      ) : (
        transactions.map((transaction, index) => (
          <Card
            key={transaction.id}
            component={motion.div}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            sx={{
              borderRadius: 4.5,
              transition: 'box-shadow 220ms ease',
              '&:hover': {
                boxShadow: 8,
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                <Stack spacing={0.6}>
                  <Typography variant="h6" fontWeight={700}>
                    {transaction.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(transaction.date).format('DD/MM/YYYY')} •{' '}
                    {transaction.type === 'expense'
                      ? categoryMap.get(transaction.category) ?? transaction.category
                      : transaction.category}
                  </Typography>
                  {transaction.notes && (
                    <Typography variant="body2" color="text.secondary">
                      {transaction.notes}
                    </Typography>
                  )}
                </Stack>
                <Stack alignItems={{ xs: 'flex-start', md: 'flex-end'}} spacing={1}>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </Typography>

                  <Stack direction="row" spacing={0.5} gap={1}>
                    <Chip
                      size="small"
                      label={transaction.type === 'income' ? 'הכנסה' : 'הוצאה'}
                      color={transaction.type === 'income' ? 'success' : 'error'}
                      variant="outlined"
                    />
                    {transaction.isRecurring && (
                      <Chip
                        size="small"
                        icon={<AutorenewRoundedIcon />}
                        label={transaction.recurringType === 'monthly' ? 'חוזר חודשי' : 'חוזר שנתי'}
                        variant="outlined"
                        sx={{
                          '& .MuiChip-label': {
                            order: 1,
                          },
                          '& .MuiChip-icon': {
                            order: 2,
                            marginLeft: 0.5,
                            marginRight: -0.5,
                          },
                        }}
                      />
                    )}
                  </Stack>

                  <Stack direction="row" spacing={0.5} gap={0.5}>
                    <Button size="small" startIcon={<EditRoundedIcon />} onClick={() => onEdit(transaction)} sx={{ padding: "4px", paddingLeft: "8px", gap: 0.8 }}>
                      עריכה
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => onDelete(transaction.id)}
                      sx={{ padding: "4px", paddingLeft: "8px", gap: 0.8 }}
                    >
                      מחיקה
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};
