import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Box, Typography, Chip } from '@mui/material';
import { listarProductos, type ProductoResumen } from '../../services/api';
import { useNotificar } from '../../components/Notificacion';
import SkeletonCards from '../../components/SkeletonCards';
import EmptyState from '../../components/EmptyState';

const ProductosGrid = () => {
  const [productos, setProductos] = useState<ProductoResumen[]>([]);
  const [loading, setLoading] = useState(true);
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
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}
    >
      {productos.map((p) => (
        <Card key={p.id} elevation={2}>
          {p.fotografia_url && (
            <CardMedia
              component="img"
              height="180"
              image={p.fotografia_url.startsWith('http') ? p.fotografia_url : `/${p.fotografia_url}`}
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
              <Typography variant="body2" color="text.secondary">
                {p.descripcion}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProductosGrid;
