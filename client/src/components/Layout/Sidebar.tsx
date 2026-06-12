import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'לוח בקרה', path: '/', icon: <DashboardRoundedIcon /> },
  { label: 'תנועות', path: '/transactions', icon: <ReceiptLongRoundedIcon /> },
  { label: 'סקירה חודשית', path: '/monthly', icon: <EventNoteRoundedIcon /> },
  { label: 'הון והתחייבויות', path: '/wealth', icon: <SavingsRoundedIcon /> },
  { label: 'תכנון עתידי', path: '/future-planning', icon: <TimelineRoundedIcon /> },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <Box sx={{ height: '100%', px: 2, py: 3 }}>
      <Stack component={motion.div} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} spacing={0.8}>
        <Chip
          label="ניהול תקציב אישי"
          size="small"
          sx={{ width: 'fit-content', bgcolor: 'primary.soft', color: 'primary.main', fontWeight: 700 }}
        />
        <Typography variant="h6" fontWeight={800} letterSpacing={0.4}>
          מעקב כספי
        </Typography>
        <Typography variant="body2" color="text.secondary">
          הכנסות, הוצאות ויתרה חודשית
        </Typography>
      </Stack>

      <List sx={{ mt: 4 }}>
        {menuItems.map((item) => (
          <ListItemButton
            component={NavLink}
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            sx={{
              mb: 1,
              borderRadius: 3,
              justifyContent: 'space-between',
              transition: 'all 180ms ease',
              '&:hover': {
                transform: 'translateX(-3px)',
              },
              '&.active': {
                bgcolor: 'primary.soft',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  textAlign: 'right',
                  fontWeight: 600,
                },
              }}
              sx={{ m: 0 }}
            />
            <ListItemIcon sx={{ minWidth: 'auto', ml: 0.8 }}>{item.icon}</ListItemIcon>
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        עדכון תנועות באופן קבוע נותן תמונה חודשית מדויקת יותר.
      </Typography>
    </Box>
  );
};
