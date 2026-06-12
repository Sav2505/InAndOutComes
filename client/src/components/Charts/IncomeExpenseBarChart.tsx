import { Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface IncomeExpenseBarChartProps {
  totalIncome: number;
  totalExpenses: number;
}

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
      sx={{ borderRadius: 4.5, height: 360 }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" fontWeight={700} mb={0.6}>
          השוואת הכנסות והוצאות
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          השוואה מהירה לחודש הנבחר
        </Typography>
        <ResponsiveContainer width="100%" height="78%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e3ea" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#1F7A8C" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
