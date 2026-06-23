import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from '@mui/material';
import { listarAccesiones, type AccesionResumen } from '../../services/api';
import { useNotificar } from '../../components/Notificacion';
import SkeletonRows from '../../components/SkeletonRows';

const AccesionesTable = () => {
  const [data, setData] = useState<AccesionResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificar } = useNotificar();

  useEffect(() => {
    listarAccesiones()
      .then(setData)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar accesiones', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 2 }}>
        <SkeletonRows rows={5} columns={6} />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2} sx={{ overflowX: 'auto', width: '100%' }}>
      <Table sx={{ minWidth: { xs: 600, sm: '100%' } }}>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Variedad</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Provincia</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Especie</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Técnico</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((a) => (
            <TableRow key={a.codigo_accesion} hover>
              <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}>
                {a.codigo_accesion}
              </TableCell>
              <TableCell>{a.cropname}</TableCell>
              <TableCell>
                <Chip
                  label={a.variedad}
                  size="small"
                  color={a.variedad === 'roja' ? 'error' : 'warning'}
                />
              </TableCell>
              <TableCell>{a.provincia}</TableCell>
              <TableCell>
                <i>
                  {a.genus} {a.species}
                </i>
              </TableCell>
              <TableCell>{a.tecnico}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccesionesTable;
