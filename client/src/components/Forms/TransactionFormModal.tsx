import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { Category, RecurringType, Transaction, TransactionType } from '../../types';

export interface TransactionFormValues {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  isRecurring: boolean;
  recurringType: RecurringType;
  notes?: string;
}

interface TransactionFormModalProps {
  open: boolean;
  categories: Category[];
  editTarget?: Transaction;
  onClose: () => void;
  onSubmit: (payload: TransactionFormValues) => void;
}

const getInitialValues = (): TransactionFormValues => ({
  title: '',
  amount: 0,
  type: 'expense',
  category: 'housing',
  date: dayjs().format('YYYY-MM-DD'),
  isRecurring: false,
  recurringType: 'none',
  notes: '',
});

export const TransactionFormModal = ({
  open,
  categories,
  editTarget,
  onClose,
  onSubmit,
}: TransactionFormModalProps) => {
  const [values, setValues] = useState<TransactionFormValues>(getInitialValues);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const expenseCategoryFallback = useMemo(
    () => categories[0]?.id ?? 'other',
    [categories],
  );

  const resetFormValues = () => {
    if (editTarget) {
      setValues({
        title: editTarget.title,
        amount: editTarget.amount,
        type: editTarget.type,
        category: editTarget.category,
        date: editTarget.date,
        isRecurring: editTarget.isRecurring,
        recurringType: editTarget.recurringType,
        notes: editTarget.notes ?? '',
      });
      return;
    }

    setValues({
      ...getInitialValues(),
      category: expenseCategoryFallback,
    });
  };

  const isExpense = values.type === 'expense';

  const canSubmit = values.title.trim().length > 1 && values.amount > 0 && values.date;

  const fieldTitleSx = {
    color: 'text.secondary',
    fontWeight: 700,
    fontSize: 13,
    textAlign: 'right',
  } as const;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{ onEnter: resetFormValues }}
      fullWidth
      fullScreen={isMobile}
      maxWidth="md"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10 },
        sx: { borderRadius: isMobile ? 0 : 4 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {editTarget ? 'עריכת תנועה' : 'הוספת תנועה'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              מלאו את הפרטים כדי לקבל תמונה חודשית ברורה ומדויקת.
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ direction: 'rtl' }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={0.7}>
                <Typography sx={fieldTitleSx}>כותרת</Typography>
                <TextField
                  fullWidth
                  placeholder="לדוגמה: קניה לבית"
                  value={values.title}
                  onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={0.7}>
                <Typography sx={fieldTitleSx}>סכום</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="0"
                  value={values.amount === 0 ? '' : values.amount}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, amount: Number(event.target.value) }))
                  }
                  slotProps={{ htmlInput: { min: 0 } }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={0.7}>
                <Typography sx={fieldTitleSx}>סוג</Typography>
                <TextField
                  fullWidth
                  select
                  value={values.type}
                  onChange={(event) => {
                    const nextType = event.target.value as TransactionType;
                    setValues((prev) => ({
                      ...prev,
                      type: nextType,
                      category: nextType === 'expense' ? expenseCategoryFallback : 'משכורת',
                    }));
                  }}
                >
                  <MenuItem value="income">הכנסה</MenuItem>
                  <MenuItem value="expense">הוצאה</MenuItem>
                </TextField>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={0.7}>
                <Typography sx={fieldTitleSx}>קטגוריה</Typography>
                <TextField
                  fullWidth
                  select
                  value={values.category}
                  onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))}
                >
                  {isExpense
                    ? categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    : ['משכורת', 'פרילנס', 'השקעות', 'הכנסה אחרת'].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                </TextField>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={0.7}>
                <Typography sx={fieldTitleSx}>תאריך</Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={values.date}
                  onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
                />
              </Stack>
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ p: 1.5, borderRadius: 3, bgcolor: 'action.hover' }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={values.isRecurring}
                  onChange={(_, checked) =>
                    setValues((prev) => ({
                      ...prev,
                      isRecurring: checked,
                      recurringType: checked ? 'monthly' : 'none',
                    }))
                  }
                />
              }
              label="תנועה חוזרת"
            />

            <Stack spacing={0.6} sx={{ minWidth: 180 }}>
              <Typography sx={fieldTitleSx}>סוג חזרה</Typography>
              <TextField
                size="small"
                disabled={!values.isRecurring}
                select
                value={values.recurringType}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    recurringType: event.target.value as RecurringType,
                  }))
                }
              >
                <MenuItem value="monthly">חודשי</MenuItem>
                <MenuItem value="yearly">שנתי</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          <Stack spacing={0.7}>
            <Typography sx={fieldTitleSx}>הערות</Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              placeholder="לא חובה"
              value={values.notes}
              onChange={(event) => setValues((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} gap={1.2} justifyContent="flex-end">
            <Button variant="text" onClick={onClose}>
              ביטול
            </Button>
            <Button
              variant="contained"
              disabled={!canSubmit}
              onClick={() => {
                onSubmit({
                  ...values,
                  notes: values.notes?.trim() || undefined,
                  recurringType: values.isRecurring ? values.recurringType : 'none',
                });
              }}
            >
              {editTarget ? 'שמירת שינויים' : 'הוספת תנועה'}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
