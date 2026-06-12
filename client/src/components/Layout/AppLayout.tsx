import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  onOpenAddTransaction: () => void;
}

const drawerWidth = 280;

export const AppLayout = ({ onOpenAddTransaction }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        anchor="right"
        open={isDesktop || mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant={isDesktop ? 'permanent' : 'temporary'}
        PaperProps={{
          sx: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        component="main"
        sx={{
          direction: 'rtl',
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 1.5, md: 3.5 },
          py: { xs: 2, md: 3 },
          mr: { lg: `${drawerWidth}px` },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            borderRadius: { xs: 3, md: 5 },
            p: { xs: 1.5, md: 2.5 },
            bgcolor: '#ffffff',
            border: '1px solid rgba(28, 42, 57, 0.08)',
          }}
        >
          <TopHeader
            onOpenSidebar={() => setMobileOpen(true)}
            onOpenAddTransaction={onOpenAddTransaction}
          />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
