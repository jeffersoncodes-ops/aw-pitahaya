import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
} from '@mui/material';
import { listarNoticias, type Noticia } from '../../services/api';
import { useNotificar } from '../../components/Notificacion';
import SkeletonCards from '../../components/SkeletonCards';
import EmptyState from '../../components/EmptyState';

const Noticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificar } = useNotificar();

  useEffect(() => {
    document.title = 'Pitahaya — Noticias';
    listarNoticias()
      .then(setNoticias)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar noticias', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }} className="fade-in-page">
      <Typography variant="h4" gutterBottom color="primary">
        Noticias y Bitácora
      </Typography>

      {loading ? (
        <Box sx={{ py: 4 }}>
          <SkeletonCards count={3} />
        </Box>
      ) : noticias.length === 0 ? (
        <EmptyState
          title="Sin noticias"
          message="No hay noticias publicadas aún."
        />
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
