import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Box, Button, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { globalButtonPaddings } from '../../utils/globals';

const pageLabels: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'לוח בקרה',
    subtitle: 'סיכום חודשי ברור של הכנסות, הוצאות ויתרה',
  },
  '/transactions': {
    title: 'תנועות',
    subtitle: 'ניהול מסודר של כל ההכנסות וההוצאות',
  },
  '/monthly': {
    title: 'סקירה חודשית',
    subtitle: 'התמונה המלאה של החודש הנבחר',
  },
  '/wealth': {
    title: 'הון והתחייבויות',
    subtitle: 'כספים יושבים מול יתרות פתוחות בזמן אמת',
  },
  '/future-planning': {
    title: 'תכנון עתידי',
    subtitle: 'צפי יתרות חודשי עד 20 שנה קדימה',
  },
};

interface TopHeaderProps {
  onOpenSidebar: () => void;
  onOpenAddTransaction: () => void;
}

export const TopHeader = ({ onOpenSidebar, onOpenAddTransaction }: TopHeaderProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const page = pageLabels[location.pathname] ?? pageLabels['/'];

  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: 3,
        p: { xs: 1.2, md: 1.6 },
        borderRadius: 3.5,
        background: '#ffffff',
        border: '1px solid rgba(28,42,57,0.08)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {!isDesktop && (
          <IconButton onClick={onOpenSidebar} size="small" aria-label="פתיחת ניווט">
            <MenuRoundedIcon />
          </IconButton>
        )}
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            {page.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {page.subtitle}
          </Typography>
        </Stack>
      </Stack>

      <Box component={motion.div} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="contained"
          endIcon={<AddRoundedIcon fontSize="small" />}
          onClick={onOpenAddTransaction}
          sx={{
            padding: globalButtonPaddings,
            '& .MuiButton-endIcon': {
              marginInlineStart: 1,
            },
          }}
        >
          הוספת תנועה
        </Button>
      </Box>
    </Stack>
  );
};
