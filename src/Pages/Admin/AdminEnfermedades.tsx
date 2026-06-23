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
  type EnfermedadAdmin,
  listarEnfermedadesAdmin,
  crearEnfermedad,
  actualizarEnfermedad,
  eliminarEnfermedad,
} from '../../services/api';
import {
  PrimaryButton,
  SectionHeader,
  EditDeleteActions,
} from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';

const AdminEnfermedades = () => {
  const { notificar } = useNotificar();
  const [enfAdmin, setEnfAdmin] = useState<EnfermedadAdmin[]>([]);
  const [enfDialogOpen, setEnfDialogOpen] = useState(false);
  const [editEnfId, setEditEnfId] = useState<number | null>(null);
  const [enfForm, setEnfForm] = useState({
    nombre_cientifico: '',
    nombre_comun: '',
    tipo: '',
    sintomas: '',
    condiciones_propagacion: '',
    tratamientos: [] as {
      nombre_tratamiento: string;
      tipo_tratamiento: string;
      descripcion: string;
      dosis: string;
      frecuencia: string;
    }[],
  });

  const cargarEnfAdmin = () =>
    listarEnfermedadesAdmin()
      .then(setEnfAdmin)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar enfermedades', 'error'));

  useEffect(() => {
    cargarEnfAdmin();
  }, []);

  const abrirCrearEnfermedad = () => {
    setEditEnfId(null);
    setEnfForm({
      nombre_cientifico: '',
      nombre_comun: '',
      tipo: '',
      sintomas: '',
      condiciones_propagacion: '',
      tratamientos: [],
    });
    setEnfDialogOpen(true);
  };

  const abrirEditarEnfermedad = (e: EnfermedadAdmin) => {
    setEditEnfId(e.id);
    setEnfForm({
      nombre_cientifico: e.nombre_cientifico,
      nombre_comun: e.nombre_comun || '',
      tipo: e.tipo || '',
      sintomas: e.sintomas || '',
      condiciones_propagacion: e.condiciones_propagacion || '',
      tratamientos: (e.tratamientos || []).map((t) => ({
        nombre_tratamiento: t.nombre_tratamiento,
        tipo_tratamiento: t.tipo_tratamiento || '',
        descripcion: t.descripcion || '',
        dosis: t.dosis || '',
        frecuencia: t.frecuencia || '',
      })),
    });
    setEnfDialogOpen(true);
  };

  const guardarEnfermedad = async () => {
    if (!enfForm.nombre_cientifico) {
      notificar('Completa el nombre científico', 'warning');
      return;
    }
    try {
      const payload = {
        nombre_cientifico: enfForm.nombre_cientifico,
        nombre_comun: enfForm.nombre_comun || undefined,
        tipo: enfForm.tipo || undefined,
        sintomas: enfForm.sintomas || undefined,
        condiciones_propagacion: enfForm.condiciones_propagacion || undefined,
        tratamientos: enfForm.tratamientos.filter((t) => t.nombre_tratamiento),
      };
      if (editEnfId) {
        await actualizarEnfermedad({ id: editEnfId, ...payload });
        notificar('Enfermedad actualizada correctamente', 'success');
      } else {
        await crearEnfermedad(payload);
        notificar('Enfermedad creada correctamente', 'success');
      }
      setEnfDialogOpen(false);
      cargarEnfAdmin();
    } catch (err: unknown) {
      notificar(err instanceof Error ? err.message : 'Error al guardar', 'error');
    }
  };

  const agregarTratamiento = () => {
    setEnfForm({
      ...enfForm,
      tratamientos: [
        ...enfForm.tratamientos,
        {
          nombre_tratamiento: '',
          tipo_tratamiento: '',
          descripcion: '',
          dosis: '',
          frecuencia: '',
        },
      ],
    });
  };

  const quitarTratamiento = (i: number) => {
    setEnfForm({ ...enfForm, tratamientos: enfForm.tratamientos.filter((_, idx) => idx !== i) });
  };

  return (
    <>
      <SectionHeader title="Enfermedades">
        <PrimaryButton onClick={abrirCrearEnfermedad}>+ Nueva Enfermedad</PrimaryButton>
      </SectionHeader>
      {enfAdmin.length === 0 ? (
        <Typography color="text.secondary">No hay enfermedades registradas.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {enfAdmin.map((e) => (
            <Paper key={e.id} variant="outlined" sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {e.nombre_cientifico}
                    {e.nombre_comun && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({e.nombre_comun})
                      </Typography>
                    )}
                  </Typography>
                  <Chip
                    label={e.tipo || 'Sin tipo'}
                    size="small"
                    color={
                      e.tipo === 'hongo' ? 'error' : e.tipo === 'bacteria' ? 'info' : 'default'
                    }
                    sx={{ mt: 0.5 }}
                  />
                  {e.sintomas && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Síntomas:</strong> {e.sintomas}
                    </Typography>
                  )}
                  {e.tratamientos && e.tratamientos.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        Tratamientos ({e.tratamientos.length}):
                      </Typography>
                      {e.tratamientos.map((t, i) => (
                        <Typography key={i} variant="caption" sx={{ display: 'block', ml: 1 }}>
                          • {t.nombre_tratamiento}
                          {t.dosis ? ` (${t.dosis})` : ''}
                          {t.frecuencia ? ` — ${t.frecuencia}` : ''}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
                <EditDeleteActions
                  onEdit={() => abrirEditarEnfermedad(e)}
                  onDelete={async () => {
                    if (!confirm(`¿Eliminar enfermedad "${e.nombre_cientifico}"?`)) return;
                    try {
                      await eliminarEnfermedad(e.id);
                      notificar('Enfermedad eliminada', 'success');
                      cargarEnfAdmin();
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

      <Dialog open={enfDialogOpen} onClose={() => setEnfDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editEnfId ? 'Editar Enfermedad' : 'Nueva Enfermedad'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Nombre científico *"
                value={enfForm.nombre_cientifico}
                onChange={(e) => setEnfForm({ ...enfForm, nombre_cientifico: e.target.value })}
                size="small"
                sx={{ minWidth: 240 }}
              />
              <TextField
                label="Nombre común"
                value={enfForm.nombre_comun}
                onChange={(e) => setEnfForm({ ...enfForm, nombre_comun: e.target.value })}
                size="small"
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Tipo"
                value={enfForm.tipo}
                onChange={(e) => setEnfForm({ ...enfForm, tipo: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
                placeholder="hongo, bacteria, virus"
              />
            </Box>
            <TextField
              label="Síntomas"
              value={enfForm.sintomas}
              onChange={(e) => setEnfForm({ ...enfForm, sintomas: e.target.value })}
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="Condiciones de propagación"
              value={enfForm.condiciones_propagacion}
              onChange={(e) => setEnfForm({ ...enfForm, condiciones_propagacion: e.target.value })}
              size="small"
              multiline
              rows={2}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                Tratamientos
              </Typography>
              <Button size="small" variant="outlined" onClick={agregarTratamiento}>
                + Agregar
              </Button>
            </Box>
            {enfForm.tratamientos.map((t, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    label="Nombre"
                    value={t.nombre_tratamiento}
                    onChange={(e) => {
                      const u = [...enfForm.tratamientos];
                      u[i] = { ...u[i], nombre_tratamiento: e.target.value };
                      setEnfForm({ ...enfForm, tratamientos: u });
                    }}
                    size="small"
                    sx={{ minWidth: 160 }}
                  />
                  <TextField
                    label="Tipo"
                    value={t.tipo_tratamiento}
                    onChange={(e) => {
                      const u = [...enfForm.tratamientos];
                      u[i] = { ...u[i], tipo_tratamiento: e.target.value };
                      setEnfForm({ ...enfForm, tratamientos: u });
                    }}
                    size="small"
                    sx={{ minWidth: 120 }}
                    placeholder="químico, biológico"
                  />
                  <TextField
                    label="Dosis"
                    value={t.dosis}
                    onChange={(e) => {
                      const u = [...enfForm.tratamientos];
                      u[i] = { ...u[i], dosis: e.target.value };
                      setEnfForm({ ...enfForm, tratamientos: u });
                    }}
                    size="small"
                    sx={{ minWidth: 100 }}
                  />
                  <TextField
                    label="Frecuencia"
                    value={t.frecuencia}
                    onChange={(e) => {
                      const u = [...enfForm.tratamientos];
                      u[i] = { ...u[i], frecuencia: e.target.value };
                      setEnfForm({ ...enfForm, tratamientos: u });
                    }}
                    size="small"
                    sx={{ minWidth: 120 }}
                  />
                  <Button size="small" color="error" onClick={() => quitarTratamiento(i)}>
                    ✕
                  </Button>
                </Box>
                <TextField
                  label="Descripción"
                  value={t.descripcion}
                  onChange={(e) => {
                    const u = [...enfForm.tratamientos];
                    u[i] = { ...u[i], descripcion: e.target.value };
                    setEnfForm({ ...enfForm, tratamientos: u });
                  }}
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnfDialogOpen(false)}>Cancelar</Button>
          <PrimaryButton onClick={guardarEnfermedad}>
            {editEnfId ? 'Actualizar' : 'Crear'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminEnfermedades;
