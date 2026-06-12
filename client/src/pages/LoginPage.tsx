import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { login } from '../hooks/useAuth';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage = ({ onSuccess }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        onSuccess();
      } else {
        setError('שם משתמש או סיסמה שגויים');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f9fb 0%, #e4f3f5 50%, #f8fdfe 100%)',
        p: 2,
      }}
    >
      <Stack
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        spacing={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: '#ffffff',
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          border: '1px solid rgba(28,42,57,0.08)',
          boxShadow: '0 8px 40px rgba(31,122,140,0.10)',
        }}
      >
        {/* Logo / Icon */}
        <Stack alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: 'linear-gradient(120deg, #1F7A8C 0%, #2ABDD4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(31,122,140,0.30)',
            }}
          >
            <LockRoundedIcon sx={{ color: 'white', fontSize: 26 }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(120deg, #1F7A8C 0%, #2ABDD4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Outcomes
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            התחבר כדי לגשת לניהול הפיננסי שלך
          </Typography>
        </Stack>

        {/* Form */}
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <TextField
            label="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            autoFocus
            fullWidth
            size="small"
          />

          <TextField
            label="סיסמה"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            fullWidth
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.2, borderRadius: 2, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'כניסה'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
