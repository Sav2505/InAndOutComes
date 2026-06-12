import { Box, Card, CardContent, Typography } from '@mui/material';
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

const yTickFormatter = (value: number) =>
  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${Math.round(value / 1_000)}k` : String(value);

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
      sx={{ borderRadius: 4.5 }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={0.6}>
          מגמה ל-6 חודשים
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          מעקב אחר התפתחות הכנסות, הוצאות ויתרה לאורך זמן
        </Typography>
        <Box sx={{ height: { xs: 240, md: 280 }, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ea" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} minTickGap={16} />
              <YAxis tickFormatter={yTickFormatter} width={45} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Line dataKey="הכנסות" stroke="#2E8B57" strokeWidth={2.6} dot={false} />
              <Line dataKey="הוצאות" stroke="#CC444B" strokeWidth={2.6} dot={false} />
              <Line dataKey="יתרה" stroke="#1F7A8C" strokeWidth={2.6} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
