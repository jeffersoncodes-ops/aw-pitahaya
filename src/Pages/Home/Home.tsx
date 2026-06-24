import { useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';
import ScienceIcon from '@mui/icons-material/Science';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import StorageIcon from '@mui/icons-material/Storage';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CarruselFotos from '../../components/CarruselFotos';
import fondoHero from '../../assets/background/fondo.png';

const Home = () => {
  useEffect(() => {
    document.title = 'Pitahaya — Biodiversidad Ecuador';
  }, []);

  return (
    <Box className="fade-in-page">
      {/* ===== HERO SECTION ===== */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 420, md: 480 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${fondoHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.35) saturate(0.8)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(27,94,32,0.85) 0%, rgba(13,59,15,0.95) 100%)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, px: 2, py: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              mb: 2,
            }}
          >
            Biodiversidad de Pitahaya
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.7,
            }}
          >
            Sistema de gestión de accesiones, caracterización morfológica, fitopatógenos y
            transferencia tecnológica de pitahaya en Ecuador
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/catalogos"
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              Ver Catálogos
            </Button>
            <Button
              component={RouterLink}
              to="/investigacion"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Datos de Investigación
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Stats / Resumen */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            mb: { xs: 4, md: 6 },
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: <GrassIcon />, label: 'Accesiones', desc: 'Germoplasma registrado' },
            { icon: <ScienceIcon />, label: 'Investigación', desc: 'Datos de laboratorio' },
            { icon: <StorageIcon />, label: 'Catálogos', desc: 'Semillas, productos y más' },
            { icon: <NewspaperIcon />, label: 'Noticias', desc: 'Bitácora del proyecto' },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'background.paper',
                px: 3,
                py: 2,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                minWidth: 180,
              }}
            >
              <Box sx={{ color: 'primary.main', display: 'flex' }}>{item.icon}</Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Carruseles */}
        <CarruselFotos titulo="Galería de Accesiones" entidadTipo="accesion" />
        <CarruselFotos titulo="Galería de Productos" entidadTipo="producto" />
        <CarruselFotos titulo="Galería de Enfermedades" entidadTipo="enfermedad" />

        {/* Cards de navegacion */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 700, mb: 3, mt: 2 }}
        >
          Explora el Sistema
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 3,
          }}
        >
          <Card
            sx={{
              borderTop: '4px solid',
              borderColor: 'secondary.main',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => window.location.href = '/catalogos'}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(198,40,40,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'secondary.main',
                  mb: 2,
                }}
              >
                <GrassIcon />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Catálogo de Semillas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                Consulta las accesiones registradas con datos de pasaporte FAO, caracterización
                morfológica y ubicación geográfica.
              </Typography>
              <Button
                component={RouterLink}
                to="/catalogos"
                size="small"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
              >
                Ir a Catálogos
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderTop: '4px solid',
              borderColor: 'primary.main',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => window.location.href = '/investigacion'}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(27,94,32,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                <ScienceIcon />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Investigación
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                Visualiza detecciones de laboratorio, enfermedades y datos técnicos de las accesiones
                colectadas en campo.
              </Typography>
              <Button
                component={RouterLink}
                to="/investigacion"
                size="small"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
              >
                Ir a Investigación
              </Button>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderTop: '4px solid',
              borderColor: '#F9A825',
              cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
            onClick={() => window.location.href = '/noticias'}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(249,168,37,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F9A825',
                  mb: 2,
                }}
              >
                <NewspaperIcon />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Noticias
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                Mantente al día con los avances del proyecto, resultados de laboratorio y actividades
                de transferencia tecnológica.
              </Typography>
              <Button
                component={RouterLink}
                to="/noticias"
                size="small"
                variant="contained"
                sx={{ bgcolor: '#F9A825', '&:hover': { bgcolor: '#F57F17' } }}
                endIcon={<ArrowForwardIcon />}
              >
                Ver Noticias
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
