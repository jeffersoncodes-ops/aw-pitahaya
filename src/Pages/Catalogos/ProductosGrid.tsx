import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardMedia, Box, Typography, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import { listarProductos, type ProductoResumen } from '../../services/api';
import { useNotificar } from '../../components/Notificacion';
import { getImageUrl } from '../../config/constants';
import SkeletonCards from '../../components/SkeletonCards';
import EmptyState from '../../components/EmptyState';

const ProductosGrid = () => {
  const [productos, setProductos] = useState<ProductoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [verProd, setVerProd] = useState<ProductoResumen | null>(null);
  const { notificar } = useNotificar();

  useEffect(() => {
    listarProductos()
      .then(setProductos)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar productos', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <SkeletonCards count={3} />
      </Box>
    );
  }

  if (productos.length === 0) {
    return (
      <EmptyState
        title="Sin productos"
        message="No hay productos registrados aún."
      />
    );
  }

  return (
    <>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}
      >
        {productos.map((p) => (
          <Card
            key={p.id}
            elevation={2}
            sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.02)', transition: '0.2s' } }}
            onClick={() => setVerProd(p)}
          >
            {p.fotografia_url && (
              <CardMedia
                component="img"
                height="180"
                image={getImageUrl(p.fotografia_url)}
                alt={p.nombre}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent>
              {p.tipo && <Chip label={p.tipo} size="small" color="primary" sx={{ mb: 1 }} />}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {p.nombre}
              </Typography>
              {p.descripcion && (
                <Typography variant="body2" color="text.secondary" sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {p.descripcion}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog detalle producto */}
      <Dialog open={!!verProd} onClose={() => setVerProd(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{verProd?.nombre}</DialogTitle>
        <DialogContent>
          {verProd && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {verProd.fotografia_url && (
                <Box
                  component="img"
                  src={getImageUrl(verProd.fotografia_url)}
                  alt={verProd.nombre}
                  sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 1 }}
                />
              )}
              {verProd.tipo && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Tipo</Typography>
                  <Chip label={verProd.tipo} size="small" color="primary" />
                </Box>
              )}
              {verProd.descripcion && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Descripción</Typography>
                  <Typography variant="body2">{verProd.descripcion}</Typography>
                </Box>
              )}
              {verProd.ingredientes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Ingredientes</Typography>
                  <Typography variant="body2">{verProd.ingredientes}</Typography>
                </Box>
              )}
              {verProd.proceso_obtencion && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Proceso de obtención</Typography>
                  <Typography variant="body2">{verProd.proceso_obtencion}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerProd(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductosGrid;
