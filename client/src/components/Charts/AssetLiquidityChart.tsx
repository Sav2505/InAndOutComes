import { Card, CardContent, Stack, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface AssetLiquidityChartProps {
  data: Array<{ label: string; value: number; color: string }>;
}

export const AssetLiquidityChart = ({ data }: AssetLiquidityChartProps) => {
  return (
    <Card sx={{ borderRadius: 4.5, height: 360 }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" fontWeight={700} mb={0.6}>נזילות הון לפי זמן</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>כמה מההון זמין עכשיו וכמה דורש זמן</Typography>

        {data.length === 0 ? (
          <Stack justifyContent="center" alignItems="center" sx={{ height: 250 }}>
            <Typography color="text.secondary">אין נתונים להצגה.</Typography>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ea" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
