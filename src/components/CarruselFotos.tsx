import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Skeleton, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { listarFotos, type Foto } from '../services/api';

interface CarruselFotosProps {
  titulo?: string;
  entidadTipo?: string;
  autoplayInterval?: number;
}

const CarruselFotos = ({
  titulo = 'Galería',
  entidadTipo,
  autoplayInterval = 4000,
}: CarruselFotosProps) => {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [actual, setActual] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarFotos(entidadTipo)
      .then(setFotos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [entidadTipo]);

  const anterior = useCallback(() => {
    setActual((a) => (a === 0 ? fotos.length - 1 : a - 1));
  }, [fotos.length]);

  const siguiente = useCallback(() => {
    setActual((a) => (a === fotos.length - 1 ? 0 : a + 1));
  }, [fotos.length]);

  // Autoplay
  useEffect(() => {
    if (fotos.length <= 1) return;
    const id = setInterval(siguiente, autoplayInterval);
    return () => clearInterval(id);
  }, [fotos.length, autoplayInterval, siguiente]);

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {titulo}
        </Typography>
        <Skeleton variant="rounded" height={300} />
      </Box>
    );
  }

  if (fotos.length === 0) return null;

  const foto = fotos[actual];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        {titulo}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          height: { xs: 250, sm: 350, md: 400 },
          bgcolor: '#1a1a1a',
        }}
      >
        <Box
          component="img"
          src={`/${foto.url}`}
          alt={foto.descripcion || 'Foto'}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s',
          }}
        />

        {foto.descripcion && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            }}
          >
            <Typography color="white" variant="body2">
              {foto.descripcion}
            </Typography>
          </Box>
        )}

        {fotos.length > 1 && (
          <>
            <IconButton
              onClick={anterior}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.4)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={siguiente}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.4)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>

            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
              }}
            >
              {fotos.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setActual(i)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: i === actual ? 'white' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </Box>

            <Chip
              label={`${actual + 1} / ${fotos.length}`}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default CarruselFotos;
