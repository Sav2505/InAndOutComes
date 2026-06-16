import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import {
  Box,
  Button,
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
import { getAuthUser, logout } from '../../hooks/useAuth';

const menuItems = [
  { label: 'סקירה חודשית', path: '/', icon: <EventNoteRoundedIcon /> },
  // { label: 'לוח בקרה', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'תנועות', path: '/transactions', icon: <ReceiptLongRoundedIcon /> },
  { label: 'הון והתחייבויות', path: '/wealth', icon: <SavingsRoundedIcon /> },
  { label: 'תכנון עתידי', path: '/future-planning', icon: <TimelineRoundedIcon /> },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const user = getAuthUser();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Box sx={{ height: '100%', px: 2, py: 3 }}>
      <Stack component={motion.div} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} spacing={0.8}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5 }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="לוגו מעקב כספי"
            sx={{ width: 38, height: 38, borderRadius: 2, flexShrink: 0 }}
          />
          <Chip
            label="ניהול תקציב אישי"
            size="small"
            sx={{ width: 'fit-content', bgcolor: 'primary.soft', color: 'primary.main', fontWeight: 700 }}
          />
        </Box>
        <Typography
          variant="h6"
          fontWeight={800}
          letterSpacing={0.4}
          sx={{
            background: 'linear-gradient(120deg, #1F7A8C 0%, #2ABDD4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 1px 6px rgba(31,122,140,0.28))',
          }}
        >
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
      <Stack spacing={1}>
        {user && (
          <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ px: 1 }}>
            שלום, {user.name}
          </Typography>
        )}
        <Button
          size="small"
          color="error"
          variant="text"
          startIcon={<LogoutRoundedIcon fontSize="small" />}
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start', px: 1 }}
        >
          התנתקות
        </Button>
        <Typography variant="caption" color="text.secondary">
          עדכון תנועות באופן קבוע נותן תמונה חודשית מדויקת יותר.
        </Typography>
      </Stack>
    </Box>
  );
};
