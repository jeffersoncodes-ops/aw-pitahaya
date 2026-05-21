import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { misSolicitudes, type SolicitudItem } from '../../services/api';

const STATUS_MAP: Record<
  string,
  { label: string; color: 'warning' | 'success' | 'error' | 'info' | 'default' }
> = {
  pendiente: { label: 'Pendiente', color: 'warning' },
  aprobada: { label: 'Aprobada', color: 'success' },
  rechazada: { label: 'Rechazada', color: 'error' },
  enviada: { label: 'Enviada', color: 'info' },
  completada: { label: 'Completada', color: 'success' },
};

const AgricultorSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    misSolicitudes()
      .then((data) => {
        if (!cancelled) setSolicitudes(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Error al cargar solicitudes');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (solicitudes.length === 0) {
    return <Alert severity="info">Aun no has realizado ninguna solicitud de semillas.</Alert>;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>N° Seguimiento</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Observaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {solicitudes.map((s) => {
            const status = STATUS_MAP[s.estado] ?? { label: s.estado, color: 'default' as const };
            return (
              <TableRow key={s.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {s.numero_seguimiento}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{s.fecha}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={status.label} color={status.color} size="small" />
                </TableCell>
                <TableCell>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {s.items?.map((item, i) => (
                      <Typography key={i} variant="caption" sx={{ display: 'list-item' }}>
                        {item.cropname} ({item.codigo}) &times;{item.cantidad} {item.unidad || 'kg'}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {s.observaciones || '—'}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AgricultorSolicitudes;
