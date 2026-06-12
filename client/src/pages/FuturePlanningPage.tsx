import {
  Card,
  CardContent,
  Grid,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { FutureBalanceForecastChart } from '../components/Charts/FutureBalanceForecastChart';
import { useFinanceStore } from '../store/financeStore';
import { formatCurrency, getFutureBalanceForecast } from '../utils/finance';

export const FuturePlanningPage = () => {
  const { transactions, assets, liabilities } = useFinanceStore();
  const [yearsAhead, setYearsAhead] = useState(10);

  const forecast = useMemo(
    () => getFutureBalanceForecast(transactions, assets, liabilities, yearsAhead * 12),
    [transactions, assets, liabilities, yearsAhead],
  );

  const firstPoint = forecast[0];
  const lastPoint = forecast[forecast.length - 1];
  const peakPoint = forecast.reduce((peak, point) => (point.netBalance > peak.netBalance ? point : peak), forecast[0]);
  const lowestPoint = forecast.reduce((lowest, point) => (point.netBalance < lowest.netBalance ? point : lowest), forecast[0]);
  const totalPlannedMonthlyContributions = assets.reduce((sum, asset) => sum + (asset.monthlyContribution ?? 0), 0);

  return (
    <Stack spacing={2.5}>
      <Card sx={{ borderRadius: 4.5 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              תכנון עתידי
            </Typography>
            <Typography variant="body2" color="text.secondary">
              תחזית חודשית מקצועית לפי הכנסות, הוצאות, תשלומי התחייבויות, הפקדות לנכסים וצבירה שנתית.
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Typography fontWeight={700}>אופק תחזית: {yearsAhead} שנים</Typography>
              <Slider
                value={yearsAhead}
                onChange={(_, value) => setYearsAhead(value as number)}
                min={1}
                max={20}
                step={1}
                marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 10, label: '10' }, { value: 15, label: '15' }, { value: 20, label: '20' }]}
                valueLabelDisplay="auto"
                sx={{ maxWidth: 420 }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">יתרה כעת</Typography>
              <Typography variant="h6" fontWeight={800} color="primary.main">
                {firstPoint ? formatCurrency(firstPoint.balance) : formatCurrency(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">יתרה בסוף התקופה</Typography>
              <Typography variant="h6" fontWeight={800} color="success.main">
                {lastPoint ? formatCurrency(lastPoint.balance) : formatCurrency(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">הפקדה חודשית לנכסים</Typography>
              <Typography variant="h6" fontWeight={800} color="info.main">
                {formatCurrency(totalPlannedMonthlyContributions)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">נקודת שפל נטו</Typography>
              <Typography variant="h6" fontWeight={800} color="error.main">
                {lowestPoint ? formatCurrency(lowestPoint.netBalance) : formatCurrency(0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lowestPoint?.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            שיא יתרה נטו: {peakPoint ? `${formatCurrency(peakPoint.netBalance)} (${peakPoint.label})` : '-'}
          </Typography>
        </CardContent>
      </Card>

      <FutureBalanceForecastChart data={forecast} />
    </Stack>
  );
};
