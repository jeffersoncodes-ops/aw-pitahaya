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
  CircularProgress,
  Box,
} from '@mui/material';
import { listarAccesiones, type AccesionResumen } from '../../services/api';

const AccesionesTable = () => {
  const [data, setData] = useState<AccesionResumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarAccesiones()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
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
