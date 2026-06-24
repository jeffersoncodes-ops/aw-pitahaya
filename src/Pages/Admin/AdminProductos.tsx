import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  type ProductoAdmin,
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../services/api';
import {
  PrimaryButton,
  SectionHeader,
  EditDeleteActions,
} from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';
import { getImageUrl } from '../../config/constants';

const AdminProductos = () => {
  const { notificar } = useNotificar();
  const [prodAdmin, setProdAdmin] = useState<ProductoAdmin[]>([]);
  const [prodDialogOpen, setProdDialogOpen] = useState(false);
  const [editProdId, setEditProdId] = useState<number | null>(null);
  const [viewProd, setViewProd] = useState<ProductoAdmin | null>(null);
  const [prodForm, setProdForm] = useState({
    nombre: '',
    tipo: '',
    descripcion: '',
    proceso_obtencion: '',
    ingredientes: '',
    fotografia_url: '',
  });

  const cargarProdAdmin = () =>
    listarProductos()
      .then(setProdAdmin)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar productos', 'error'));

  useEffect(() => {
    cargarProdAdmin();
  }, []);

  const abrirCrearProducto = () => {
    setEditProdId(null);
    setProdForm({
      nombre: '',
      tipo: '',
      descripcion: '',
      proceso_obtencion: '',
      ingredientes: '',
      fotografia_url: '',
    });
    setProdDialogOpen(true);
  };

  const abrirEditarProducto = (p: ProductoAdmin) => {
    setEditProdId(p.id);
    setProdForm({
      nombre: p.nombre,
      tipo: p.tipo || '',
      descripcion: p.descripcion || '',
      proceso_obtencion: p.proceso_obtencion || '',
      ingredientes: p.ingredientes || '',
      fotografia_url: p.fotografia_url || '',
    });
    setProdDialogOpen(true);
  };

  const abrirVerProducto = (p: ProductoAdmin) => setViewProd(p);

  const guardarProducto = async () => {
    if (!prodForm.nombre) {
      notificar('Completa el nombre del producto', 'warning');
      return;
    }
    try {
      const payload = { ...prodForm, fotografia_url: prodForm.fotografia_url || undefined };
      if (editProdId) {
        await actualizarProducto({ id: editProdId, ...payload });
        notificar('Producto actualizado correctamente', 'success');
      } else {
        await crearProducto(payload);
        notificar('Producto creado correctamente', 'success');
      }
      setProdDialogOpen(false);
      cargarProdAdmin();
    } catch (err: unknown) {
      notificar(err instanceof Error ? err.message : 'Error al guardar', 'error');
    }
  };

  return (
    <>
      <SectionHeader title="Productos">
        <PrimaryButton onClick={abrirCrearProducto}>+ Nuevo Producto</PrimaryButton>
      </SectionHeader>
      {prodAdmin.length === 0 ? (
        <Typography color="text.secondary">No hay productos registrados.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {prodAdmin.map((p) => (
            <Paper
              key={p.id}
              variant="outlined"
              sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => abrirVerProducto(p)}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {p.nombre}
                  </Typography>
                  <Chip label={p.tipo || 'Sin tipo'} size="small" sx={{ mt: 0.5 }} />
                  {p.descripcion && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {p.descripcion}
                    </Typography>
                  )}
                  {p.ingredientes && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      <strong>Ingredientes:</strong> {p.ingredientes}
                    </Typography>
                  )}
                  {p.proceso_obtencion && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      <strong>Proceso:</strong> {p.proceso_obtencion}
                    </Typography>
                  )}
                </Box>
                <EditDeleteActions
                  onEdit={() => abrirEditarProducto(p)}
                  onDelete={async () => {
                    if (!confirm(`¿Eliminar producto "${p.nombre}"?`)) return;
                    try {
                      await eliminarProducto(p.id);
                      notificar('Producto eliminado', 'success');
                      cargarProdAdmin();
                    } catch (err: unknown) {
                      notificar(err instanceof Error ? err.message : 'Error', 'error');
                    }
                  }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={prodDialogOpen}
        onClose={() => setProdDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editProdId ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Nombre *"
                value={prodForm.nombre}
                onChange={(e) => setProdForm({ ...prodForm, nombre: e.target.value })}
                size="small"
                sx={{ minWidth: 240 }}
              />
              <TextField
                select
                label="Tipo"
                value={prodForm.tipo}
                onChange={(e) => setProdForm({ ...prodForm, tipo: e.target.value })}
                size="small"
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">— Ninguno —</MenuItem>
                <MenuItem value="vino">Vino</MenuItem>
                <MenuItem value="licor">Licor</MenuItem>
                <MenuItem value="mermelada">Mermelada</MenuItem>
                <MenuItem value="harina">Harina</MenuItem>
                <MenuItem value="aceite">Aceite</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>
            </Box>
            <TextField
              label="Descripción"
              value={prodForm.descripcion}
              onChange={(e) => setProdForm({ ...prodForm, descripcion: e.target.value })}
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="Proceso de obtención"
              value={prodForm.proceso_obtencion}
              onChange={(e) => setProdForm({ ...prodForm, proceso_obtencion: e.target.value })}
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="Ingredientes"
              value={prodForm.ingredientes}
              onChange={(e) => setProdForm({ ...prodForm, ingredientes: e.target.value })}
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="URL de foto (opcional)"
              value={prodForm.fotografia_url}
              onChange={(e) => setProdForm({ ...prodForm, fotografia_url: e.target.value })}
              size="small"
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProdDialogOpen(false)}>Cancelar</Button>
          <PrimaryButton onClick={guardarProducto}>
            {editProdId ? 'Actualizar' : 'Crear'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Dialog de detalle */}
      <Dialog
        open={!!viewProd}
        onClose={() => setViewProd(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{viewProd?.nombre}</DialogTitle>
        <DialogContent>
          {viewProd && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {viewProd.tipo && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Tipo</Typography>
                  <Chip label={viewProd.tipo} size="small" />
                </Box>
              )}
              {viewProd.descripcion && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Descripción</Typography>
                  <Typography variant="body2">{viewProd.descripcion}</Typography>
                </Box>
              )}
              {viewProd.ingredientes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Ingredientes</Typography>
                  <Typography variant="body2">{viewProd.ingredientes}</Typography>
                </Box>
              )}
              {viewProd.proceso_obtencion && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Proceso de obtención</Typography>
                  <Typography variant="body2">{viewProd.proceso_obtencion}</Typography>
                </Box>
              )}
              {viewProd.fotografia_url && (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: 1,
                    bgcolor: '#1a1a1a',
                    backgroundImage: `url(${getImageUrl(viewProd.fotografia_url)})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewProd(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProductos;
