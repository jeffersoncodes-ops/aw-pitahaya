import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { type SolicitudAdmin, actualizarSolicitud, eliminarSolicitud } from '../../services/api';
import { PrimaryButton, StyledTableHead } from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';
import EmptyState from '../../components/EmptyState';

interface SolicitudesTableProps {
  solicitudes: SolicitudAdmin[];
  onRefresh: () => void;
}

function SolicitudesTable({ solicitudes, onRefresh }: SolicitudesTableProps) {
  const { notificar } = useNotificar();

  // Dialog gestionar solicitud
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<SolicitudAdmin | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const abrirDialog = (s: SolicitudAdmin) => {
    setSelected(s);
    setNuevoEstado(s.estado);
    setObservaciones(s.observaciones || '');
    setDialogOpen(true);
  };

  const guardarCambio = async () => {
    if (!selected) return;
    try {
      await actualizarSolicitud({
        id: selected.id,
        estado: nuevoEstado,
        observaciones,
      });
      notificar('Solicitud actualizada correctamente', 'success');
      setDialogOpen(false);
      onRefresh();
    } catch (err: unknown) {
      notificar(err instanceof Error ? err.message : 'Error al actualizar', 'error');
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Todas las Solicitudes
      </Typography>
      {solicitudes.length === 0 ? (
        <EmptyState
          title="Sin solicitudes"
          message="No hay solicitudes pendientes."
        />
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ mb: 4 }}>
          <Table>
            <StyledTableHead
              columns={[
                { label: '# Seguimiento' },
                { label: 'Solicitante' },
                { label: 'Items' },
                { label: 'Estado' },
                { label: 'Fecha' },
                { label: 'Atendido por' },
                { label: 'Acción' },
              ]}
            />
            <TableBody>
              {solicitudes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{s.numero_seguimiento}</TableCell>
                  <TableCell>
                    {s.solicitante_nombre}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {s.solicitante_email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {s.items?.map((item, i) => (
                      <div key={i}>
                        <Typography variant="caption">
                          {item.codigo} x{item.cantidad}
                        </Typography>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.estado}
                      size="small"
                      color={
                        s.estado === 'pendiente'
                          ? 'warning'
                          : s.estado === 'aprobada'
                            ? 'success'
                            : s.estado === 'entregada'
                              ? 'info'
                              : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell>{s.fecha}</TableCell>
                  <TableCell>{s.atendido_por || '—'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button size="small" variant="outlined" onClick={() => abrirDialog(s)}>
                        Gestionar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={async () => {
                          if (!confirm(`¿Eliminar solicitud #${s.numero_seguimiento}?`)) return;
                          try {
                            await eliminarSolicitud(s.id);
                            notificar('Solicitud eliminada', 'success');
                            onRefresh();
                          } catch (err: unknown) {
                            notificar(err instanceof Error ? err.message : 'Error', 'error');
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog gestionar solicitud */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Solicitud {selected?.numero_seguimiento}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            <strong>Solicitante:</strong> {selected?.solicitante_nombre} (
            {selected?.solicitante_email})
          </Typography>
          {selected?.solicitante_telefono && (
            <Typography variant="body2" gutterBottom>
              <strong>Teléfono:</strong> {selected?.solicitante_telefono}
            </Typography>
          )}
          {selected?.solicitante_finca && (
            <Typography variant="body2" gutterBottom>
              <strong>Finca:</strong> {selected?.solicitante_finca}
            </Typography>
          )}
          <Box sx={{ mt: 2 }}>
            <Select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="aprobada">Aprobada</MenuItem>
              <MenuItem value="rechazada">Rechazada</MenuItem>
              <MenuItem value="entregada">Entregada</MenuItem>
            </Select>
            <TextField
              label="Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <PrimaryButton onClick={guardarCambio}>Guardar</PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SolicitudesTable;
