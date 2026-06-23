import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { listarEnfermedades, type Enfermedad } from '../../services/api';
import { useNotificar } from '../../components/Notificacion';
import SkeletonCards from '../../components/SkeletonCards';
import EmptyState from '../../components/EmptyState';

const EnfermedadesList = () => {
  const [data, setData] = useState<Enfermedad[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificar } = useNotificar();

  useEffect(() => {
    listarEnfermedades()
      .then(setData)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar enfermedades', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <SkeletonCards count={3} />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Sin enfermedades"
        message="No hay enfermedades registradas aún."
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {data.map((enf) => (
        <Card key={enf.id} elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {enf.nombre_comun}
              </Typography>
              <Chip
                label={enf.tipo}
                size="small"
                color={
                  enf.tipo === 'hongo' ? 'warning' : enf.tipo === 'bacteria' ? 'error' : 'info'
                }
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <i>{enf.nombre_cientifico}</i>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {enf.sintomas}
            </Typography>

            {enf.tratamientos && enf.tratamientos.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
                  Tratamientos:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tratamiento</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Dosis</TableCell>
                        <TableCell>Frecuencia</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enf.tratamientos.map((t) => (
                        <TableRow key={`${t.nombre}-${t.tipo}-${t.dosis}-${t.frecuencia}`}>
                          <TableCell>{t.nombre}</TableCell>
                          <TableCell>
                            <Chip label={t.tipo} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>{t.dosis}</TableCell>
                          <TableCell>{t.frecuencia}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default EnfermedadesList;
