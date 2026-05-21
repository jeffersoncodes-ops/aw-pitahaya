import { Card, CardContent, Box, Typography, Chip } from '@mui/material';

const productos = [
  {
    nombre: 'Vino artesanal de pitahaya roja',
    tipo: 'Vino',
    descripcion: 'Vino con 12% de alcohol, sabor frutal y color característico',
  },
  {
    nombre: 'Mermelada de pitahaya amarilla',
    tipo: 'Mermelada',
    descripcion: 'Mermelada artesanal sin conservantes, ideal para desayunos',
  },
  {
    nombre: 'Licor cremoso de pitahaya',
    tipo: 'Licor',
    descripcion: 'Licor cremoso con base de pitahaya y leche condensada, 18% alcohol',
  },
];

const ProductosGrid = () => (
  <Box
    sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}
  >
    {productos.map((p, i) => (
      <Card key={i} elevation={2}>
        <CardContent>
          <Chip label={p.tipo} size="small" color="primary" sx={{ mb: 1 }} />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {p.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {p.descripcion}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default ProductosGrid;
