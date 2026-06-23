import { Box, Typography } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        width: '100%',
      }}
    >
      <Box sx={{ height: 3, bgcolor: 'secondary.main' }} />

      <Box sx={{ maxWidth: 340, mx: 'auto', width: '100%', px: 3, pt: 0.5, pb: 1.5, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, whiteSpace: 'nowrap' }}>
          Escuela Superior Politécnica de Chimborazo
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, whiteSpace: 'nowrap' }}>
          © {currentYear} — Todos los derechos reservados
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
