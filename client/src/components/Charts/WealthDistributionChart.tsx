import { Box, Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const outerRadius = isMobile ? 70 : 90;
  const innerRadius = isMobile ? 42 : 56;

  const activeData = useMemo(
    () => (mode === 'assets' ? assetsData : liabilitiesData),
    [mode, assetsData, liabilitiesData],
  );

  const total = useMemo(
    () => activeData.reduce((sum, item) => sum + item.value, 0),
    [activeData],
  );

  return (
    <Card sx={{ borderRadius: 4.5 }}>
      <CardContent sx={{ px: { xs: 1, md: 2 }, py: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" mb={2} gap={1}>
          <div style={{ textAlign: 'center', flex: 1 }}>
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
          <Stack justifyContent="center" alignItems="center" sx={{ height: 220 }}>
            <Typography color="text.secondary">אין נתונים להצגה.</Typography>
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={1}>
            <Box sx={{ width: '100%', height: { xs: 220, md: 240 }, direction: 'ltr' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activeData} dataKey="value" nameKey="name" outerRadius={outerRadius} innerRadius={innerRadius}>
                    {activeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 160 } }} spacing={0.8} alignItems="center">
              {activeData.map((entry) => {
                const ratio = total > 0 ? Math.round((entry.value / total) * 100) : 0;

                return (
                  <Stack key={entry.name} direction="row" alignItems="center" gap={1.5}>
                    <Stack direction="row" alignItems="center" gap={0.7}>
                      <span style={{ width: 10, height: 10, borderRadius: 9999, background: entry.color, display: 'inline-block' }} />
                      <Typography variant="body2">{entry.name}</Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{ratio}%</Typography>
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
