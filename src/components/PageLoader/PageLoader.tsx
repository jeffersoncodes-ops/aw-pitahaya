import { Box, Typography, CircularProgress } from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';

const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      gap: 2,
    }}
  >
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress size={64} thickness={3} sx={{ color: 'primary.main' }} />
      <GrassIcon
        sx={{
          position: 'absolute',
          fontSize: 28,
          color: 'primary.main',
        }}
      />
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
      Cargando...
    </Typography>
  </Box>
);

export default PageLoader;
