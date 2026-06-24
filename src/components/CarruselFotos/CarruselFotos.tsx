import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Skeleton,
  Dialog,
  DialogContent,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { listarFotos, type Foto } from '../../services/api';
import { useNotificar } from '../Notificacion';
import { getImageUrl } from '../../config/constants';

interface GaleriaGridProps {
  titulo?: string;
  entidadTipo?: string;
}

const GaleriaGrid = ({
  titulo = 'Galería',
  entidadTipo,
}: GaleriaGridProps) => {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Foto | null>(null);
  const { notificar } = useNotificar();

  useEffect(() => {
    listarFotos(entidadTipo)
      .then(setFotos)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar fotos', 'error'))
      .finally(() => setLoading(false));
  }, [entidadTipo]);

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {titulo}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={200} />
          ))}
        </Box>
      </Box>
    );
  }

  if (fotos.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        {titulo}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 2,
        }}
      >
        {fotos.map((foto) => (
          <Card
            key={foto.id}
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
            }}
            onClick={() => setSelected(foto)}
          >
            <Box
              sx={{
                width: '100%',
                height: 200,
                bgcolor: '#1a1a1a',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={getImageUrl(foto.url)}
                alt={foto.descripcion || `${titulo} ${foto.id}`}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
            {foto.descripcion && (
              <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {foto.descripcion}
                </Typography>
              </CardContent>
            )}
          </Card>
        ))}
      </Box>

      {/* Lightbox / Vista completa */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'rgba(0,0,0,0.92)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
            },
          },
        }}
      >
        <IconButton
          onClick={() => setSelected(null)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
          }}
        >
          {selected && (
            <Box
              component="img"
              src={getImageUrl(selected.url)}
              alt={selected.descripcion || 'Foto'}
              sx={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
        {selected?.descripcion && (
          <Typography
            variant="body2"
            sx={{ p: 2, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}
          >
            {selected.descripcion}
          </Typography>
        )}
      </Dialog>
    </Box>
  );
};

export default GaleriaGrid;
