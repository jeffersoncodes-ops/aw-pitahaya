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
} from '@mui/material';
import {
  type NoticiaAdmin,
  listarNoticiasAdmin,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
} from '../../services/api';
import {
  PrimaryButton,
  SectionHeader,
  EditDeleteActions,
} from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';

const AdminNoticias = () => {
  const { notificar } = useNotificar();
  const [noticias, setNoticias] = useState<NoticiaAdmin[]>([]);
  const [notiDialogOpen, setNotiDialogOpen] = useState(false);
  const [editNotiId, setEditNotiId] = useState<number | null>(null);
  const [notiForm, setNotiForm] = useState({ titulo: '', contenido: '', foto_url: '' });

  const cargarNoticias = () => {
    listarNoticiasAdmin()
      .then(setNoticias)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar noticias', 'error'));
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const abrirCrearNoticia = () => {
    setEditNotiId(null);
    setNotiForm({ titulo: '', contenido: '', foto_url: '' });
    setNotiDialogOpen(true);
  };

  const abrirEditarNoticia = (n: NoticiaAdmin) => {
    setEditNotiId(n.id);
    setNotiForm({ titulo: n.titulo, contenido: n.contenido, foto_url: n.foto_url || '' });
    setNotiDialogOpen(true);
  };

  const guardarNoticia = async () => {
    if (!notiForm.titulo || !notiForm.contenido) {
      notificar('Completa los campos requeridos: Título y Contenido', 'warning');
      return;
    }
    try {
      const payload = { ...notiForm, foto_url: notiForm.foto_url || undefined };
      if (editNotiId) {
        await actualizarNoticia({ id: editNotiId, ...payload });
        notificar('Noticia actualizada correctamente', 'success');
      } else {
        await crearNoticia(payload);
        notificar('Noticia creada correctamente', 'success');
      }
      setNotiDialogOpen(false);
      cargarNoticias();
    } catch (err: unknown) {
      notificar(err instanceof Error ? err.message : 'Error al guardar la noticia', 'error');
    }
  };

  return (
    <>
      <SectionHeader title="Noticias">
        <PrimaryButton onClick={abrirCrearNoticia}>+ Nueva Noticia</PrimaryButton>
      </SectionHeader>
      {noticias.length === 0 ? (
        <Typography color="text.secondary">No hay noticias.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {noticias.map((n) => (
            <Paper key={n.id} variant="outlined" sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {n.titulo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {n.fecha} — {n.autor}
                  </Typography>
                  {!n.activo && (
                    <Chip label="Inactiva" size="small" color="default" sx={{ ml: 1 }} />
                  )}
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {n.contenido}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
                  <EditDeleteActions
                    onEdit={() => abrirEditarNoticia(n)}
                    onDelete={async () => {
                      if (!confirm(`¿Eliminar la noticia "${n.titulo}"?`)) return;
                      try {
                      await eliminarNoticia(n.id);
                      notificar('Noticia eliminada', 'success');
                      cargarNoticias();
                    } catch (err: unknown) {
                      notificar(err instanceof Error ? err.message : 'Error', 'error');
                      }
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={notiDialogOpen}
        onClose={() => setNotiDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editNotiId ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Título *"
              value={notiForm.titulo}
              onChange={(e) => setNotiForm({ ...notiForm, titulo: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Contenido *"
              value={notiForm.contenido}
              onChange={(e) => setNotiForm({ ...notiForm, contenido: e.target.value })}
              fullWidth
              multiline
              rows={6}
              size="small"
            />
            <TextField
              label="URL de foto (opcional)"
              value={notiForm.foto_url}
              onChange={(e) => setNotiForm({ ...notiForm, foto_url: e.target.value })}
              fullWidth
              size="small"
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotiDialogOpen(false)}>Cancelar</Button>
          <PrimaryButton onClick={guardarNoticia}>
            {editNotiId ? 'Actualizar' : 'Crear'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminNoticias;
