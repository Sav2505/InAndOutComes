import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface AssetLiquidityChartProps {
  data: Array<{ label: string; value: number; color: string }>;
}

const yTickFormatter = (value: number) =>
  value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${Math.round(value / 1_000)}k` : String(value);

export const AssetLiquidityChart = ({ data }: AssetLiquidityChartProps) => {
  return (
    <Card sx={{ borderRadius: 4.5 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={0.6}>נזילות הון לפי זמן</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>כמה מההון זמין עכשיו וכמה דורש זמן</Typography>

        {data.length === 0 ? (
          <Stack justifyContent="center" alignItems="center" sx={{ height: 220 }}>
            <Typography color="text.secondary">אין נתונים להצגה.</Typography>
          </Stack>
        ) : (
          <Box sx={{ height: { xs: 220, md: 260 }, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e3ea" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={yTickFormatter} width={45} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
