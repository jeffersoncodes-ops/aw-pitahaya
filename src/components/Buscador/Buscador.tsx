import { useState } from 'react';
import {
  TextField,
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
import { buscar, type BusquedaResultado } from '../../services/api';

const Buscador = () => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState<BusquedaResultado[]>([]);

  const handleBuscar = () => {
    if (!termino.trim()) return;
    buscar(termino)
      .then(setResultados)
      .catch(() => {});
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar por nombre, variedad, provincia..."
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
        sx={{ mb: 3 }}
      />

      {resultados.length > 0 && (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Código</TableCell>
                <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white' }}>Provincia</TableCell>
                <TableCell sx={{ color: 'white' }}>Variedad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.map((r) => (
                <TableRow key={r.codigo_accesion}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{r.codigo_accesion}</TableCell>
                  <TableCell>{r.accename}</TableCell>
                  <TableCell>{r.provincia}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.variedad}
                      size="small"
                      color={r.variedad === 'roja' ? 'error' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Buscador;
