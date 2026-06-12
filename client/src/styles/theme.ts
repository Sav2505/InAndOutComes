import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    soft?: string;
  }

  interface SimplePaletteColorOptions {
    soft?: string;
  }
}

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#1F7A8C',
      soft: '#E4F3F5',
    },
    secondary: {
      main: '#4E79A7',
    },
    success: {
      main: '#2E8B57',
    },
    error: {
      main: '#CC444B',
    },
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C2A39',
      secondary: '#617283',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Manrope", "DM Sans", "Segoe UI", sans-serif',
    h5: {
      fontWeight: 800,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundAttachment: 'fixed',
          direction: 'rtl',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 18,
          boxShadow: 'none',
          transition: 'transform 180ms ease, box-shadow 220ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 20px rgba(31, 122, 140, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'medium',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FAFCFD',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(28, 42, 57, 0.06)',
          boxShadow: '0 10px 28px rgba(28, 42, 57, 0.07)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#ffffff',
        },
      },
    },
  },
});

export default theme;
