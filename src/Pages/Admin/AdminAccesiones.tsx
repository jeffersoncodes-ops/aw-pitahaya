import { useEffect, useState } from 'react';
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
  type AccesionResumen,
  type CrearAccesionData,
  type Donante,
  type Propietario,
  type Tecnico,
  listarAccesiones,
  listarTecnicos,
  listarPropietarios,
  listarDonantes,
  crearAccesion,
  actualizarAccesion,
  eliminarAccesion,
} from '../../services/api';
import {
  PrimaryButton,
  SectionHeader,
  StyledTableHead,
  EditDeleteActions,
} from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';

const AdminAccesiones = () => {
  const { notificar } = useNotificar();
  const [accesiones, setAccesiones] = useState<AccesionResumen[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [donantes, setDonantes] = useState<Donante[]>([]);
  const [accDialogOpen, setAccDialogOpen] = useState(false);
  const [editAccId, setEditAccId] = useState<number | null>(null);
  const [accForm, setAccForm] = useState({
    codigo_accesion: '',
    cropname: '',
    accename: '',
    variedad: '',
    provincia: '',
    genus: '',
    species: '',
    latitude: '',
    longitude: '',
    elevation: '',
    tecnico_id: 0,
    propietario_id: 0,
    donante_id: 0,
    acqdate: '',
    colldate: '',
    collsite: '',
    origcty: '',
    tipo_suelo: '',
    collnumb: '',
    collcode: '',
    instcode: '',
    remarks: '',
    sampstat: '',
    collsrc: '',
    storage: '',
  });

  const cargarAccesiones = () => {
    listarAccesiones()
      .then(setAccesiones)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar accesiones', 'error'));
  };

  const cargarSelectores = () => {
    listarTecnicos()
      .then(setTecnicos)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar técnicos', 'error'));
    listarPropietarios()
      .then(setPropietarios)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar propietarios', 'error'));
    listarDonantes()
      .then(setDonantes)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar donantes', 'error'));
  };

  useEffect(() => {
    cargarAccesiones();
    cargarSelectores();
  }, []);

  const resetAccForm = () => {
    setAccForm({
      codigo_accesion: '',
      cropname: '',
      accename: '',
      variedad: '',
      provincia: '',
      genus: '',
      species: '',
      latitude: '',
      longitude: '',
      elevation: '',
      tecnico_id: 0,
      propietario_id: 0,
      donante_id: 0,
      acqdate: '',
      colldate: '',
      collsite: '',
      origcty: '',
      tipo_suelo: '',
      collnumb: '',
      collcode: '',
      instcode: '',
      remarks: '',
      sampstat: '',
      collsrc: '',
      storage: '',
    });
    setEditAccId(null);
  };

  const abrirCrearAccesion = () => {
    resetAccForm();
    setAccDialogOpen(true);
  };

  const abrirEditarAccesion = (a: AccesionResumen) => {
    setEditAccId(a.id);
    setAccForm({
      codigo_accesion: a.codigo_accesion,
      cropname: a.cropname || '',
      accename: a.accename || '',
      variedad: a.variedad || '',
      provincia: a.provincia || '',
      genus: a.genus || '',
      species: a.species || '',
      latitude: a.latitude || '',
      longitude: a.longitude || '',
      elevation: a.elevation?.toString() || '',
      tecnico_id: a.tecnico_id,
      propietario_id: a.propietario_id,
      donante_id: a.donante_id ?? 0,
      acqdate: '',
      colldate: '',
      collsite: '',
      origcty: '',
      tipo_suelo: '',
      collnumb: '',
      collcode: '',
      instcode: '',
      remarks: '',
      sampstat: '',
      collsrc: '',
      storage: '',
    });
    setAccDialogOpen(true);
  };

  const guardarAccesion = async () => {
    if (!accForm.codigo_accesion || !accForm.tecnico_id || !accForm.propietario_id) {
      notificar('Completa los campos requeridos: Código, Técnico y Propietario', 'warning');
      return;
    }
    try {
      const payload = {
        ...accForm,
        latitude: accForm.latitude ? Number(accForm.latitude) : undefined,
        longitude: accForm.longitude ? Number(accForm.longitude) : undefined,
        elevation: accForm.elevation ? Number(accForm.elevation) : undefined,
        tecnico_id: Number(accForm.tecnico_id),
        propietario_id: Number(accForm.propietario_id),
        donante_id: accForm.donante_id ? Number(accForm.donante_id) : undefined,
      } as CrearAccesionData;
      if (editAccId) {
        await actualizarAccesion({ ...payload, id: editAccId });
        notificar('Accesión actualizada correctamente', 'success');
      } else {
        await crearAccesion(payload);
        notificar('Accesión creada correctamente', 'success');
      }
      setAccDialogOpen(false);
      cargarAccesiones();
      cargarSelectores();
    } catch (err: unknown) {
      notificar(err instanceof Error ? err.message : 'Error al guardar la accesión', 'error');
    }
  };

  return (
    <>
      <SectionHeader title="Accesiones">
        <PrimaryButton onClick={abrirCrearAccesion}>+ Nueva Accesión</PrimaryButton>
      </SectionHeader>
      {accesiones.length === 0 ? (
        <Typography color="text.secondary">No hay accesiones registradas.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table size="small">
            <StyledTableHead
              columns={[
                { label: 'Código' },
                { label: 'Cultivo' },
                { label: 'Nombre' },
                { label: 'Variedad' },
                { label: 'Provincia' },
                { label: 'Técnico' },
                { label: 'Propietario' },
                { label: 'Acción' },
              ]}
            />
            <TableBody>
              {accesiones.map((a) => (
                <TableRow key={a.id}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{a.codigo_accesion}</TableCell>
                  <TableCell>{a.cropname || '—'}</TableCell>
                  <TableCell>{a.accename || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={a.variedad || '—'}
                      size="small"
                      color={a.variedad === 'roja' ? 'error' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{a.provincia || '—'}</TableCell>
                  <TableCell>{a.tecnico}</TableCell>
                  <TableCell>{a.propietario}</TableCell>
                  <TableCell>
                    <EditDeleteActions
                      onEdit={() => abrirEditarAccesion(a)}
                      onDelete={async () => {
                        if (!confirm(`¿Eliminar la accesión ${a.codigo_accesion}?`)) return;
                        try {
                          await eliminarAccesion(a.id);
                          notificar('Accesión eliminada', 'success');
                          cargarAccesiones();
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
      )}

      {/* Dialog Crear/Editar Accesion */}
      <Dialog open={accDialogOpen} onClose={() => setAccDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editAccId ? 'Editar Accesión' : 'Nueva Accesión'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Identificación
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Código *"
                value={accForm.codigo_accesion}
                onChange={(e) => setAccForm({ ...accForm, codigo_accesion: e.target.value })}
                size="small"
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="Cultivo (cropname)"
                value={accForm.cropname}
                onChange={(e) => setAccForm({ ...accForm, cropname: e.target.value })}
                size="small"
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="Nombre (accename)"
                value={accForm.accename}
                onChange={(e) => setAccForm({ ...accForm, accename: e.target.value })}
                size="small"
                sx={{ minWidth: 220 }}
              />
              <TextField
                label="Variedad"
                value={accForm.variedad}
                onChange={(e) => setAccForm({ ...accForm, variedad: e.target.value })}
                size="small"
                sx={{ minWidth: 120 }}
              />
            </Box>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Origen
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Provincia"
                value={accForm.provincia}
                onChange={(e) => setAccForm({ ...accForm, provincia: e.target.value })}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="País (origcty)"
                value={accForm.origcty}
                onChange={(e) => setAccForm({ ...accForm, origcty: e.target.value })}
                size="small"
                sx={{ minWidth: 100 }}
              />
              <TextField
                label="Sitio (collsite)"
                value={accForm.collsite}
                onChange={(e) => setAccForm({ ...accForm, collsite: e.target.value })}
                size="small"
                sx={{ minWidth: 220 }}
              />
              <TextField
                label="Género"
                value={accForm.genus}
                onChange={(e) => setAccForm({ ...accForm, genus: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="Especie"
                value={accForm.species}
                onChange={(e) => setAccForm({ ...accForm, species: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
            </Box>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Coordenadas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Latitud"
                type="number"
                value={accForm.latitude}
                onChange={(e) => setAccForm({ ...accForm, latitude: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="Longitud"
                type="number"
                value={accForm.longitude}
                onChange={(e) => setAccForm({ ...accForm, longitude: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="Elevación (msnm)"
                type="number"
                value={accForm.elevation}
                onChange={(e) => setAccForm({ ...accForm, elevation: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
            </Box>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Fechas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Fecha adquisición"
                type="date"
                value={accForm.acqdate}
                onChange={(e) => setAccForm({ ...accForm, acqdate: e.target.value })}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="Fecha colecta"
                type="date"
                value={accForm.colldate}
                onChange={(e) => setAccForm({ ...accForm, colldate: e.target.value })}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ minWidth: 180 }}
              />
            </Box>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Responsables *
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Select
                value={accForm.tecnico_id}
                onChange={(e) => setAccForm({ ...accForm, tecnico_id: Number(e.target.value) })}
                size="small"
                displayEmpty
                sx={{ minWidth: 220 }}
              >
                <MenuItem value={0} disabled>
                  Seleccionar técnico...
                </MenuItem>
                {tecnicos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.nombre}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={accForm.propietario_id}
                onChange={(e) => setAccForm({ ...accForm, propietario_id: Number(e.target.value) })}
                size="small"
                displayEmpty
                sx={{ minWidth: 220 }}
              >
                <MenuItem value={0} disabled>
                  Seleccionar propietario...
                </MenuItem>
                {propietarios.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre_productor}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={accForm.donante_id}
                onChange={(e) => setAccForm({ ...accForm, donante_id: Number(e.target.value) })}
                size="small"
                displayEmpty
                sx={{ minWidth: 220 }}
              >
                <MenuItem value={0}>Sin donante</MenuItem>
                {donantes.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.institucion || d.nombre || `ID ${d.id}`}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
              Adicional
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Tipo de suelo"
                value={accForm.tipo_suelo}
                onChange={(e) => setAccForm({ ...accForm, tipo_suelo: e.target.value })}
                size="small"
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="Código colección"
                value={accForm.collcode}
                onChange={(e) => setAccForm({ ...accForm, collcode: e.target.value })}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Número colecta"
                value={accForm.collnumb}
                onChange={(e) => setAccForm({ ...accForm, collnumb: e.target.value })}
                size="small"
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Inst. código"
                value={accForm.instcode}
                onChange={(e) => setAccForm({ ...accForm, instcode: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="Sampstat"
                value={accForm.sampstat}
                onChange={(e) => setAccForm({ ...accForm, sampstat: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="Collsrc"
                value={accForm.collsrc}
                onChange={(e) => setAccForm({ ...accForm, collsrc: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
              <TextField
                label="Storage"
                value={accForm.storage}
                onChange={(e) => setAccForm({ ...accForm, storage: e.target.value })}
                size="small"
                sx={{ minWidth: 140 }}
              />
            </Box>
            <TextField
              label="Observaciones"
              value={accForm.remarks}
              onChange={(e) => setAccForm({ ...accForm, remarks: e.target.value })}
              size="small"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccDialogOpen(false)}>Cancelar</Button>
          <PrimaryButton onClick={guardarAccesion}>
            {editAccId ? 'Actualizar' : 'Crear'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminAccesiones;
