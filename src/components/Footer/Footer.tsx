import { Box, Typography, Container, Divider } from '@mui/material';
import GrassIcon from '@mui/icons-material/Grass';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        width: '100%',
        mt: 'auto',
      }}
    >
      <Box sx={{ height: 4, bgcolor: 'secondary.main' }} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 4,
          }}
        >
          {/* Columna 1: Marca */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <GrassIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Pitahaya
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.75, maxWidth: 280, lineHeight: 1.7 }}>
              Sistema de gestión de accesiones, caracterización morfológica, fitopatógenos y
              transferencia tecnológica de pitahaya en Ecuador.
            </Typography>
          </Box>

          {/* Columna 2: Institución */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
              Institución
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  Escuela Superior Politécnica de Chimborazo
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  admin@pitahaya.gob.ec
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Columna 3: Enlaces rápidos */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
              Enlaces
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Catálogos', to: '/catalogos' },
                { label: 'Investigación', to: '/investigacion' },
                { label: 'Noticias', to: '/noticias' },
              ].map((link) => (
                <Typography
                  key={link.label}
                  component="a"
                  href={link.to}
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 1, textDecoration: 'underline' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

        <Typography variant="caption" sx={{ opacity: 0.5, display: 'block', textAlign: 'center' }}>
          © {currentYear} — Todos los derechos reservados. Proyecto académico ESPOCH.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
