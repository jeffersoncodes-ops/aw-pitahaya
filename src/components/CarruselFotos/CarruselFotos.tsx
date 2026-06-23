import { useState, useEffect, useCallback, useRef } from 'react';
import { keyframes } from '@mui/material/styles';
import { Box, Typography, IconButton, Skeleton, Chip } from '@mui/material';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { listarFotos, type Foto } from '../../services/api';
import { useNotificar } from '../Notificacion';

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
  const { notificar } = useNotificar();

  useEffect(() => {
    listarFotos(entidadTipo)
      .then(setFotos)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar fotos', 'error'))
      .finally(() => setLoading(false));
  }, [entidadTipo]);

  const anterior = useCallback(() => {
    setActual((a) => (a === 0 ? fotos.length - 1 : a - 1));
  }, [fotos.length]);

  const siguiente = useCallback(() => {
    setActual((a) => (a === fotos.length - 1 ? 0 : a + 1));
  }, [fotos.length]);

  const intervalRef = useRef<number>(undefined);

  useEffect(() => {
    if (fotos.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActual((prev) => (prev + 1) % fotos.length);
    }, autoplayInterval);
    return () => clearInterval(intervalRef.current);
  }, [fotos.length, autoplayInterval]);

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
          height: { xs: 180, sm: 240, md: 280 },
          bgcolor: '#1a1a1a',
        }}
      >
        <Box
          component="img"
          src={`/${foto.url}`}
          alt={foto.descripcion || 'Foto'}
          key={foto.id}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            animation: `${fadeIn} 0.6s ease`,
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
