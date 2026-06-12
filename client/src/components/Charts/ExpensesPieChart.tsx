import { Card, CardContent, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/finance';

interface ExpensesPieChartProps {
  data: Array<{ name: string; value: number; color: string }>;
}

export const ExpensesPieChart = ({ data }: ExpensesPieChartProps) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ borderRadius: 4.5, height: 360 }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h6" fontWeight={700} mb={0.6}>
          הוצאות לפי קטגוריה
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          חלוקת ההוצאות בחודש הנבחר
        </Typography>

        {data.length === 0 ? (
          <Stack justifyContent="center" alignItems="center" sx={{ height: 260 }}>
            <Typography color="text.secondary">אין נתוני הוצאות לחודש זה.</Typography>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} innerRadius={52}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
