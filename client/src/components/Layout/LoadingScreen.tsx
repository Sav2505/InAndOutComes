import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        zIndex: 9999,
        gap: 3,
      }}
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.1 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
          }}
        >
          {/* Spinner with logo in the center */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 88,
              height: 88,
            }}
          >
            {/* Track ring */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={88}
              thickness={2}
              sx={{ color: 'primary.main', opacity: 0.12, position: 'absolute' }}
            />
            {/* Spinning ring */}
            <CircularProgress
              size={88}
              thickness={2}
              sx={{ color: 'primary.main', position: 'absolute' }}
            />
            {/* Logo */}
            <Box
              component="img"
              src="/logo.svg"
              alt="לוגו"
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(31,122,140,0.18)',
              }}
            />
          </Box>

          {/* App name */}
          <Typography
            variant="h6"
            fontWeight={800}
            letterSpacing={0.5}
            sx={{
              background: 'linear-gradient(120deg, #1F7A8C 0%, #2ABDD4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 1px 6px rgba(31,122,140,0.22))',
            }}
          >
            מעקב כספי
          </Typography>

          {/* Animated dots */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              טוען נתונים
            </Typography>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', color: '#617283', fontSize: 14, fontWeight: 500 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              >
                .
              </motion.span>
            ))}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};
