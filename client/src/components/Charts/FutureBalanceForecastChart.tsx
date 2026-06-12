import { Box, Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FutureForecastPoint } from '../../utils/finance';
import { formatCurrency } from '../../utils/finance';

interface FutureBalanceForecastChartProps {
  data: FutureForecastPoint[];
}

export const FutureBalanceForecastChart = ({ data }: FutureBalanceForecastChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    'יתרה עתידית': item.balance,
    'יתרה נטו (אחרי חוב)': item.netBalance,
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
          צפי יתרות עתידי
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          התפתחות ההון החודשי עד 20 שנה קדימה, כולל הפקדות לנכסים, צבירה שנתית והשפעת התחייבויות
        </Typography>

        <Box sx={{ height: { xs: 280, sm: 340, md: 380 }, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="futureBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F7A8C" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#1F7A8C" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="futureNetBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4E79A7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4E79A7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ea" />
            <XAxis dataKey="label" minTickGap={24} />
            <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} width={60} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload as FutureForecastPoint | undefined;

                if (!point) {
                  return '';
                }

                return `${point.label} | הכנסות: ${formatCurrency(point.income)} | הוצאות: ${formatCurrency(point.expenses)} | הפקדות לנכסים: ${formatCurrency(point.assetContributions)} | צבירה: ${formatCurrency(point.assetGrowth)} | התחייבויות: ${formatCurrency(point.liabilityPayments)}`;
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="יתרה עתידית"
              stroke="#1F7A8C"
              fill="url(#futureBalanceGradient)"
              strokeWidth={2.4}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="יתרה נטו (אחרי חוב)"
              stroke="#4E79A7"
              fill="url(#futureNetBalanceGradient)"
              strokeWidth={2.2}
              dot={false}
            />
          </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
