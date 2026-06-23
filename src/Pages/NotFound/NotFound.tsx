import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SentimentDissatisfied from '@mui/icons-material/SentimentDissatisfied';

function NotFound() {
  useEffect(() => {
    document.title = 'Pitahaya — Página no encontrada';
  }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
        py: 8,
        px: 2,
      }}
    >
      <SentimentDissatisfied
        sx={{ fontSize: 96, color: 'text.disabled', mb: 2 }}
      />
      <Typography variant="h2" sx={{ fontWeight: 700 }} color="text.secondary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480 }}>
        La página que buscas no existe o fue movida.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Volver al inicio
      </Button>
    </Box>
  );
}

export default NotFound;
