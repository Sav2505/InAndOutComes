import { Box, Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface IncomeExpenseBarChartProps {
  totalIncome: number;
  totalExpenses: number;
}

const yTickFormatter = (value: number) =>
  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${Math.round(value / 1_000)}k` : String(value);

export const IncomeExpenseBarChart = ({ totalIncome, totalExpenses }: IncomeExpenseBarChartProps) => {
  const data = [
    { name: 'הכנסות', value: totalIncome },
    { name: 'הוצאות', value: totalExpenses },
  ];

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ borderRadius: 4.5 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={0.6}>
          השוואת הכנסות והוצאות
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          השוואה מהירה לחודש הנבחר
        </Typography>
        <Box sx={{ height: { xs: 220, md: 260 }, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e3ea" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={yTickFormatter} width={45} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#1F7A8C" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
