import { Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface MonthlyTrendChartProps {
  data: Array<{ month: string; income: number; expenses: number; balance: number }>;
}

export const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    הכנסות: item.income,
    הוצאות: item.expenses,
    יתרה: item.balance,
  }));

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ borderRadius: 4.5, height: 390 }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" fontWeight={700} mb={0.6}>
          מגמה ל-6 חודשים
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          מעקב אחר התפתחות הכנסות, הוצאות ויתרה לאורך זמן
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ea" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line dataKey="הכנסות" stroke="#2E8B57" strokeWidth={2.6} dot={false} />
            <Line dataKey="הוצאות" stroke="#CC444B" strokeWidth={2.6} dot={false} />
            <Line dataKey="יתרה" stroke="#1F7A8C" strokeWidth={2.6} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
