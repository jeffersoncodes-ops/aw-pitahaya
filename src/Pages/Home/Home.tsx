import { useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CarruselFotos from '../../components/CarruselFotos';

const Home = () => {
  useEffect(() => {
    document.title = 'Pitahaya — Inicio';
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="fade-in-page">
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
        <Typography variant="h3" color="primary" gutterBottom>
          Biodiversidad de Pitahaya
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
          Sistema de gestión de accesiones, caracterización morfológica, fitopatógenos y
          transferencia tecnológica de pitahaya en Ecuador
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={RouterLink} to="/catalogos" variant="contained" color="secondary">
            Ver Catálogos
          </Button>
          <Button component={RouterLink} to="/investigacion" variant="outlined" color="secondary">
            Datos de Investigación
          </Button>
        </Box>
      </Box>

      {/* Carruseles */}
      <CarruselFotos titulo="Galería de Accesiones" entidadTipo="accesion" />
      <CarruselFotos titulo="Galería de Productos" entidadTipo="producto" />
      <CarruselFotos titulo="Galería de Enfermedades" entidadTipo="enfermedad" />

      {/* Cards de navegacion */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Explora el Sistema
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 3,
        }}
      >
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🌱 Catálogo de Semillas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Consulta las accesiones registradas con datos de pasaporte FAO, caracterización
              morfológica y ubicación geográfica.
            </Typography>
            <Button
              component={RouterLink}
              to="/catalogos"
              size="small"
              variant="contained"
              color="secondary"
            >
              Ir a Catálogos
            </Button>
          </CardContent>
        </Card>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🔬 Investigación
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Visualiza detecciones de laboratorio, enfermedades y datos técnicos de las accesiones
              colectadas en campo.
            </Typography>
            <Button
              component={RouterLink}
              to="/investigacion"
              size="small"
              variant="contained"
              color="secondary"
            >
              Ir a Investigación
            </Button>
          </CardContent>
        </Card>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📰 Noticias
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mantente al día con los avances del proyecto, resultados de laboratorio y actividades
              de transferencia tecnológica.
            </Typography>
            <Button
              component={RouterLink}
              to="/noticias"
              size="small"
              variant="contained"
              color="secondary"
            >
              Ver Noticias
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Home;
