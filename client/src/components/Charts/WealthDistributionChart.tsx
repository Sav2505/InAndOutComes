import { Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface DistributionPoint {
  name: string;
  value: number;
  color: string;
}

interface WealthDistributionChartProps {
  assetsData: DistributionPoint[];
  liabilitiesData: DistributionPoint[];
}

export const WealthDistributionChart = ({ assetsData, liabilitiesData }: WealthDistributionChartProps) => {
  const [mode, setMode] = useState<'assets' | 'liabilities'>('assets');

  const activeData = useMemo(
    () => (mode === 'assets' ? assetsData : liabilitiesData),
    [mode, assetsData, liabilitiesData],
  );

  const total = useMemo(
    () => activeData.reduce((sum, item) => sum + item.value, 0),
    [activeData],
  );

  return (
    <Card sx={{ borderRadius: 4.5, height: 390 }}>
      <CardContent sx={{ height: '100%' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" mb={2} gap={1}>
          <div>
            <Typography variant="h6" fontWeight={700}>גרף התפלגות</Typography>
            <Typography variant="body2" color="text.secondary">חלוקת יתרות לפי סוג</Typography>
          </div>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={mode}
            onChange={(_, value: 'assets' | 'liabilities' | null) => {
              if (value) {
                setMode(value);
              }
            }}
          >
            <ToggleButton value="assets">נכסים</ToggleButton>
            <ToggleButton value="liabilities">התחייבויות</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {activeData.length === 0 ? (
          <Stack justifyContent="center" alignItems="center" sx={{ height: 250 }}>
            <Typography color="text.secondary">אין נתונים להצגה.</Typography>
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" sx={{ height: '78%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activeData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={56}>
                  {activeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <Stack minWidth={190} spacing={0.8}>
              {activeData.map((entry) => {
                const ratio = total > 0 ? Math.round((entry.value / total) * 100) : 0;

                return (
                  <Stack key={entry.name} direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                    <Stack direction="row" alignItems="center" gap={0.7}>
                      <span style={{ width: 10, height: 10, borderRadius: 9999, background: entry.color, display: 'inline-block' }} />
                      <Typography variant="body2">{entry.name}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{ratio}%</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
