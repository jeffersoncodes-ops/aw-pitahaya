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
import {
  type InventarioItem,
  type AccesionResumen,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
} from '../../services/api';
import { PrimaryButton, StyledTableHead, EditDeleteActions } from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';
import EmptyState from '../../components/EmptyState';

interface InventarioTableProps {
  inventario: InventarioItem[];
  accesiones: AccesionResumen[];
  onRefresh: () => void;
}

function InventarioTable({ inventario, accesiones, onRefresh }: InventarioTableProps) {
  const { notificar } = useNotificar();

  // Dialog inventario
  const [invDialogOpen, setInvDialogOpen] = useState(false);
  const [editInvId, setEditInvId] = useState<number | null>(null);
  const [invForm, setInvForm] = useState({
    codigo_ubicacion: '',
    cantidad_disponible: 0,
    unidad: 'libras',
    accesion_id: 0,
  });

  const abrirCrearInventario = () => {
    setEditInvId(null);
    setInvForm({ codigo_ubicacion: '', cantidad_disponible: 0, unidad: 'libras', accesion_id: 0 });
    setInvDialogOpen(true);
  };

  const abrirEditarInventario = (item: InventarioItem) => {
    setEditInvId(item.id);
    setInvForm({
      codigo_ubicacion: item.codigo_ubicacion,
      cantidad_disponible: item.cantidad_disponible,
      unidad: item.unidad || 'libras',
      accesion_id: item.accesion_id,
    });
    setInvDialogOpen(true);
  };

  const guardarInventario = async () => {
    if (!invForm.codigo_ubicacion) {
      notificar('Completa el código de ubicación', 'warning');
      return;
    }
    if (!invForm.accesion_id) {
      notificar('Selecciona una accesión', 'warning');
      return;
    }
    try {
      if (editInvId) {
        await actualizarInventario({ id: editInvId, ...invForm });
        notificar('Inventario actualizado correctamente', 'success');
      } else {
        await crearInventario(invForm);
        notificar('Item de inventario creado correctamente', 'success');
      }
      setInvDialogOpen(false);
      onRefresh();
    } catch (err: unknown) {
      notificar(err instanceof Error ? err.message : 'Error al guardar', 'error');
    }
  };

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
          Inventario en Almacén
        </Typography>
        <PrimaryButton onClick={abrirCrearInventario}>+ Nuevo Item</PrimaryButton>
      </Box>
      {inventario.length > 0 ? (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <StyledTableHead
              columns={[
                { label: 'Ubicación' },
                { label: 'Accesión' },
                { label: 'Variedad' },
                { label: 'Disponible' },
                { label: 'Unidad' },
                { label: 'Acción' },
              ]}
            />
            <TableBody>
              {inventario.map((i, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Chip
                      label={i.codigo_ubicacion}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{i.codigo_accesion}</TableCell>
                  <TableCell>
                    <Chip
                      label={i.variedad}
                      size="small"
                      color={i.variedad === 'roja' ? 'error' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{i.cantidad_disponible}</TableCell>
                  <TableCell>{i.unidad || 'libras'}</TableCell>
                  <TableCell>
                    <EditDeleteActions
                      onEdit={() => abrirEditarInventario(i)}
                      onDelete={async () => {
                        if (
                          !confirm(
                            `¿Eliminar item ${i.codigo_ubicacion} (${i.codigo_accesion})?`,
                          )
                        )
                          return;
                        try {
                          await eliminarInventario(i.id);
                          notificar('Item eliminado', 'success');
                          onRefresh();
                        } catch (err: unknown) {
                          notificar(err instanceof Error ? err.message : 'Error', 'error');
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState
          title="Sin inventario"
          message="No hay inventario registrado aún."
        />
      )}

      {/* Dialog Crear/Editar Inventario */}
      <Dialog open={invDialogOpen} onClose={() => setInvDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editInvId ? 'Editar Item de Inventario' : 'Nuevo Item de Inventario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Código de Ubicación *"
              value={invForm.codigo_ubicacion}
              onChange={(e) => setInvForm({ ...invForm, codigo_ubicacion: e.target.value })}
              size="small"
              placeholder="Ej: A-01, B-03"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Cantidad *"
                type="number"
                value={invForm.cantidad_disponible}
                onChange={(e) =>
                  setInvForm({ ...invForm, cantidad_disponible: Number(e.target.value) })
                }
                size="small"
                sx={{ flex: 1 }}
              />
              <Select
                value={invForm.unidad}
                onChange={(e) => setInvForm({ ...invForm, unidad: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="libras">Libras</MenuItem>
                <MenuItem value="kilogramos">Kilogramos</MenuItem>
                <MenuItem value="gramos">Gramos</MenuItem>
                <MenuItem value="unidades">Unidades</MenuItem>
                <MenuItem value="semillas">Semillas</MenuItem>
                <MenuItem value="plantas">Plantas</MenuItem>
                <MenuItem value="litros">Litros</MenuItem>
                <MenuItem value="mililitros">Mililitros</MenuItem>
              </Select>
            </Box>
            <Select
              value={invForm.accesion_id}
              onChange={(e) => setInvForm({ ...invForm, accesion_id: Number(e.target.value) })}
              size="small"
              displayEmpty
            >
              <MenuItem value={0} disabled>
                Seleccionar accesión...
              </MenuItem>
              {accesiones.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.codigo_accesion} — {a.accename} ({a.variedad})
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvDialogOpen(false)}>Cancelar</Button>
          <PrimaryButton onClick={guardarInventario}>
            {editInvId ? 'Actualizar' : 'Crear'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InventarioTable;
