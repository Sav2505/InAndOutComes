import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/finance';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
}

const cards = [
  {
    key: 'income',
    label: 'סך הכנסות',
    icon: <ArrowUpwardRoundedIcon />,
    color: 'success.main',
  },
  {
    key: 'expenses',
    label: 'סך הוצאות',
    icon: <ArrowDownwardRoundedIcon />,
    color: 'error.main',
  },
  {
    key: 'balance',
    label: 'יתרה חודשית',
    icon: <AccountBalanceWalletRoundedIcon />,
    color: 'primary.main',
  },
] as const;

export const SummaryCards = ({ income, expenses, balance }: SummaryCardsProps) => {
  const values = { income, expenses, balance };

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid key={card.key} size={{ xs: 12, md: 4 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.36 }}
            sx={{
              borderRadius: 4,
              position: 'relative',
              transition: 'transform 220ms ease, box-shadow 240ms ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 2.4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    bgcolor: 'action.hover',
                    color: card.color,
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                  }}
                >
                  {card.icon}
                </Stack>
              </Stack>
              <Typography variant="h5" fontWeight={700} color={card.color}>
                {formatCurrency(values[card.key])}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
