import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { listarNoticias, type Noticia } from '../../services/api';

const Noticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarNoticias()
      .then(setNoticias)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Noticias y Bitácora
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : noticias.length === 0 ? (
        <Typography color="text.secondary">No hay noticias aún.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {noticias.map((n) => (
            <Card key={n.id} elevation={2}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {n.titulo}
                  </Typography>
                  <Chip label={n.fecha} size="small" variant="outlined" />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Por: {n.autor}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {n.contenido}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Noticias;
