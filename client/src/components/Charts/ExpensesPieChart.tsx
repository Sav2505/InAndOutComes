import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface ExpensesPieChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

export const ExpensesPieChart = ({ data }: ExpensesPieChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const outerRadius = isMobile ? 70 : 90;
  const innerRadius = isMobile ? 40 : 52;

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ borderRadius: 4.5 }}
    >
      <CardContent sx={{ px: { xs: 1, md: 2 }, py: { xs: 1.5, md: 2 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
        <Typography variant="h6" fontWeight={700} mb={0.6} textAlign="center">
          הוצאות לפי קטגוריה
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
          חלוקת ההוצאות בחודש הנבחר
        </Typography>

        {data.length === 0 ? (
          <Stack justifyContent="center" alignItems="center" sx={{ height: 220 }}>
            <Typography color="text.secondary">אין נתוני הוצאות לחודש זה.</Typography>
          </Stack>
        ) : (
          <Box sx={{ height: { xs: 220, md: 260 }, width: '100%', direction: 'ltr' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={outerRadius} innerRadius={innerRadius}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
