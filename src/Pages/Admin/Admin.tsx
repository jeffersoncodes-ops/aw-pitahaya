import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  adminResumen,
  listarSolicitudesAdmin,
  actualizarSolicitud,
  eliminarSolicitud,
  listarAccesiones,
  listarFotos,
  listarEnfermedadesResumen,
  listarProductos,
  actualizarFoto,
  eliminarFoto,
  listarTecnicos,
  listarPropietarios,
  listarDonantes,
  crearAccesion,
  actualizarAccesion,
  eliminarAccesion,
  listarNoticiasAdmin,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  listarEnfermedadesAdmin,
  crearEnfermedad,
  actualizarEnfermedad,
  eliminarEnfermedad,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  listarInventario,
  actualizarInventario,
  eliminarInventario,
  crearInventario,
  type CrearAccesionData,
  type AdminResumen,
  type SolicitudAdmin,
  type AccesionResumen,
  type Foto,
  type EnfermedadResumen,
  type ProductoResumen,
  type Tecnico,
  type Propietario,
  type Donante,
  type NoticiaAdmin,
  type EnfermedadAdmin,
  type ProductoAdmin,
  type InventarioItem,
} from '../../services/api';
import SubirFoto from '../../components/SubirFoto';
import {
  PrimaryButton,
  SectionHeader,
  StyledTableHead,
  EditDeleteActions,
  TabButton,
} from '../../components/AdminUI';

const Admin = () => {
  const [resumen, setResumen] = useState<AdminResumen | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState(0);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<SolicitudAdmin | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Seccion fotos
  const [accesiones, setAccesiones] = useState<AccesionResumen[]>([]);
  const [enfermedades, setEnfermedades] = useState<EnfermedadResumen[]>([]);
  const [productos, setProductos] = useState<ProductoResumen[]>([]);
  const [entidadFotos, setEntidadFotos] = useState<'accesion' | 'enfermedad' | 'producto'>(
    'accesion',
  );
  const [entidadFotosId, setEntidadFotosId] = useState<number>(0);
  const [fotosSubidas, setFotosSubidas] = useState<Foto[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [fotoTab, setFotTab] = useState<'todas' | 'subir'>('todas');
  const [todasFotos, setTodasFotos] = useState<Foto[]>([]);

  // Seccion gestion accesiones
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

  // Seccion noticias
  const [noticias, setNoticias] = useState<NoticiaAdmin[]>([]);
  const [notiDialogOpen, setNotiDialogOpen] = useState(false);
  const [editNotiId, setEditNotiId] = useState<number | null>(null);
  const [notiForm, setNotiForm] = useState({ titulo: '', contenido: '', foto_url: '' });

  const cargarNoticias = () => {
    listarNoticiasAdmin()
      .then(setNoticias)
      .catch(() => console.error('Error al cargar noticias'));
  };

  // Seccion enfermedades
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
      .catch(() => console.error('Error al cargar enfermedades'));

  // Seccion productos
  const [prodAdmin, setProdAdmin] = useState<ProductoAdmin[]>([]);
  const [prodDialogOpen, setProdDialogOpen] = useState(false);
  const [editProdId, setEditProdId] = useState<number | null>(null);
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
      .catch(() => console.error('Error al cargar productos'));

  // Dialog inventario
  const [invDialogOpen, setInvDialogOpen] = useState(false);
  const [editInvId, setEditInvId] = useState<number | null>(null);
  const [invForm, setInvForm] = useState({
    codigo_ubicacion: '',
    cantidad_disponible: 0,
    unidad: 'libras',
    accesion_id: 0,
  });
  const cargarInventario = () =>
    listarInventario().catch(() => console.error('Error al cargar inventario'));

  const cargarTodasFotos = () => {
    listarFotos()
      .then(setTodasFotos)
      .catch(() => console.error('Error al cargar fotos'));
  };

  const cargarListas = () => {
    listarAccesiones()
      .then(setAccesiones)
      .catch(() => console.error('Error al cargar accesiones'));
    listarEnfermedadesResumen()
      .then(setEnfermedades)
      .catch(() => console.error('Error al cargar enfermedades'));
    listarProductos()
      .then(setProductos)
      .catch(() => console.error('Error al cargar productos'));
    // Selectores admin
    listarTecnicos()
      .then(setTecnicos)
      .catch(() => console.error('Error al cargar técnicos'));
    listarPropietarios()
      .then(setPropietarios)
      .catch(() => console.error('Error al cargar propietarios'));
    listarDonantes()
      .then(setDonantes)
      .catch(() => console.error('Error al cargar donantes'));
  };

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
    setAccDialogOpen(true);
  };

  const guardarAccesion = async () => {
    if (!accForm.codigo_accesion || !accForm.tecnico_id || !accForm.propietario_id) {
      setMensaje('Completa los campos requeridos: Código, Técnico y Propietario');
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
        setMensaje('Accesión actualizada correctamente');
      } else {
        await crearAccesion(payload);
        setMensaje('Accesión creada correctamente');
      }
      setAccDialogOpen(false);
      cargarListas();
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al guardar la accesión');
    }
  };

  const cargarFotos = () => {
    if (!entidadFotosId) return;
    listarFotos(entidadFotos, entidadFotosId)
      .then(setFotosSubidas)
      .catch(() => console.error('Error al cargar fotos'));
  };

  // Noticias
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
      setMensaje('Completa los campos requeridos: Título y Contenido');
      return;
    }
    try {
      const payload = { ...notiForm, foto_url: notiForm.foto_url || undefined };
      if (editNotiId) {
        await actualizarNoticia({ id: editNotiId, ...payload });
        setMensaje('Noticia actualizada correctamente');
      } else {
        await crearNoticia(payload);
        setMensaje('Noticia creada correctamente');
      }
      setNotiDialogOpen(false);
      cargarNoticias();
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al guardar la noticia');
    }
  };

  // Enfermedades
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
      setMensaje('Completa el nombre científico');
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
        setMensaje('Enfermedad actualizada correctamente');
      } else {
        await crearEnfermedad(payload);
        setMensaje('Enfermedad creada correctamente');
      }
      setEnfDialogOpen(false);
      cargarEnfAdmin();
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al guardar');
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

  // Productos
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

  const guardarProducto = async () => {
    if (!prodForm.nombre) {
      setMensaje('Completa el nombre del producto');
      return;
    }
    try {
      const payload = { ...prodForm, fotografia_url: prodForm.fotografia_url || undefined };
      if (editProdId) {
        await actualizarProducto({ id: editProdId, ...payload });
        setMensaje('Producto actualizado correctamente');
      } else {
        await crearProducto(payload);
        setMensaje('Producto creado correctamente');
      }
      setProdDialogOpen(false);
      cargarProdAdmin();
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  // Inventario
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
      setMensaje('Completa el código de ubicación');
      return;
    }
    if (!invForm.accesion_id) {
      setMensaje('Selecciona una accesión');
      return;
    }
    try {
      if (editInvId) {
        await actualizarInventario({ id: editInvId, ...invForm });
        setMensaje('Inventario actualizado correctamente');
      } else {
        await crearInventario(invForm);
        setMensaje('Item de inventario creado correctamente');
      }
      setInvDialogOpen(false);
      cargarInventario();
      cargarDatos(); // refresca dashboard
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const cargarDatos = () => {
    setLoading(true);
    Promise.all([
      adminResumen()
        .then(setResumen)
        .catch(() => console.error('Error al cargar resumen')),
      listarSolicitudesAdmin()
        .then(setSolicitudes)
        .catch(() => console.error('Error al cargar solicitudes')),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
    cargarListas();
    cargarTodasFotos();
    cargarNoticias();
    cargarEnfAdmin();
    cargarProdAdmin();
    cargarInventario();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const t = resumen?.totals;

  const abrirDialog = (s: SolicitudAdmin) => {
    setSelected(s);
    setNuevoEstado(s.estado);
    setObservaciones(s.observaciones || '');
    setMensaje('');
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
      setMensaje('Solicitud actualizada correctamente');
      setDialogOpen(false);
      cargarDatos();
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
        Panel de Administración
      </Typography>

      {mensaje && (
        <Alert
          severity={mensaje.includes('correctamente') ? 'success' : 'error'}
          sx={{ mb: 2 }}
          onClose={() => setMensaje('')}
        >
          {mensaje}
        </Alert>
      )}

      <Tabs
        value={adminTab}
        onChange={(_, v) => setAdminTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Dashboard" />
        <Tab label="Accesiones" />
        <Tab label="Enfermedades" />
        <Tab label="Productos" />
        <Tab label="Noticias" />
        <Tab label="Fotos" />
      </Tabs>

      {/* ==================== DASHBOARD ==================== */}
      {adminTab === 0 && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
              mb: 4,
            }}
          >
            <Card
              elevation={2}
              sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {t?.total_accesiones}
                </Typography>
                <Typography>Accesiones</Typography>
              </CardContent>
            </Card>
            <Card elevation={2} sx={{ bgcolor: '#2E7D32', color: 'white', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {t?.total_solicitudes}
                </Typography>
                <Typography>Solicitudes</Typography>
              </CardContent>
            </Card>
            <Card
              elevation={2}
              sx={{
                bgcolor: t && t.pendientes > 0 ? '#E65100' : '#2E7D32',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {t?.pendientes}
                </Typography>
                <Typography>Pendientes</Typography>
              </CardContent>
            </Card>
            <Card elevation={2} sx={{ bgcolor: '#1565C0', color: 'white', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {t?.total_enfermedades}
                </Typography>
                <Typography>Enfermedades</Typography>
              </CardContent>
            </Card>
          </Box>

          <Typography variant="h6" gutterBottom>
            Todas las Solicitudes
          </Typography>
          {solicitudes.length === 0 ? (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              No hay solicitudes.
            </Typography>
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
                                setMensaje('Solicitud eliminada');
                                cargarDatos();
                              } catch (err: unknown) {
                                setMensaje(err instanceof Error ? err.message : 'Error');
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

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
              Inventario en Almacén
            </Typography>
            <PrimaryButton onClick={abrirCrearInventario}>+ Nuevo Item</PrimaryButton>
          </Box>
          {resumen?.inventario && resumen.inventario.length > 0 ? (
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
                  {resumen.inventario.map((i, idx) => (
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
                              setMensaje('Item eliminado');
                              cargarDatos();
                            } catch (err: unknown) {
                              setMensaje(err instanceof Error ? err.message : 'Error');
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
            <Typography color="text.secondary">Sin inventario registrado.</Typography>
          )}
        </>
      )}

      {/* ==================== ACCESIONES ==================== */}
      {adminTab === 1 && (
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
                              setMensaje('Accesión eliminada');
                              cargarListas();
                            } catch (err: unknown) {
                              setMensaje(err instanceof Error ? err.message : 'Error');
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
        </>
      )}

      {/* ==================== ENFERMEDADES ==================== */}
      {adminTab === 2 && (
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
                          setMensaje('Enfermedad eliminada');
                          cargarEnfAdmin();
                        } catch (err: unknown) {
                          setMensaje(err instanceof Error ? err.message : 'Error');
                        }
                      }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {/* ==================== PRODUCTOS ==================== */}
      {adminTab === 3 && (
        <>
          <SectionHeader title="Productos">
            <PrimaryButton onClick={abrirCrearProducto}>+ Nuevo Producto</PrimaryButton>
          </SectionHeader>
          {prodAdmin.length === 0 ? (
            <Typography color="text.secondary">No hay productos registrados.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {prodAdmin.map((p) => (
                <Paper key={p.id} variant="outlined" sx={{ p: 2 }}>
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
                          setMensaje('Producto eliminado');
                          cargarProdAdmin();
                        } catch (err: unknown) {
                          setMensaje(err instanceof Error ? err.message : 'Error');
                        }
                      }}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {/* ==================== NOTICIAS ==================== */}
      {adminTab === 4 && (
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
                            setMensaje('Noticia eliminada');
                            cargarNoticias();
                          } catch (err: unknown) {
                            setMensaje(err instanceof Error ? err.message : 'Error');
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}

      {/* ==================== FOTOS ==================== */}
      {adminTab === 5 && (
        <>
          <SectionHeader title="Fotos">
            <TabButton
              active={fotoTab === 'todas'}
              onClick={() => {
                setFotTab('todas');
                cargarTodasFotos();
              }}
            >
              Todas las Fotos
            </TabButton>
            <TabButton active={fotoTab === 'subir'} onClick={() => setFotTab('subir')}>
              Subir Foto
            </TabButton>
          </SectionHeader>

          {fotoTab === 'todas' && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              {todasFotos.length === 0 ? (
                <Typography color="text.secondary">No hay fotos subidas aún.</Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {todasFotos.map((f) => (
                    <Paper key={f.id} variant="outlined" sx={{ width: 200, p: 1 }}>
                      <img
                        src={`/${f.url}`}
                        alt={f.descripcion || ''}
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        <strong>{f.entidad_tipo}</strong> ID {f.entidad_id}
                      </Typography>
                      {editandoId === f.id ? (
                        <Box sx={{ mt: 0.5 }}>
                          <TextField
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            size="small"
                            fullWidth
                            placeholder="Descripción"
                          />
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={async () => {
                                try {
                                  await actualizarFoto(f.id, editDesc);
                                  setEditandoId(null);
                                  cargarTodasFotos();
                                } catch {
                                  console.error('Error al actualizar foto');
                                }
                              }}
                            >
                              Guardar
                            </Button>
                            <Button size="small" onClick={() => setEditandoId(null)}>
                              Cancelar
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            {f.descripcion || 'Sin descripción'}
                          </Typography>
                          <EditDeleteActions
                            onEdit={() => {
                              setEditandoId(f.id);
                              setEditDesc(f.descripcion || '');
                            }}
                            onDelete={async () => {
                              if (!confirm('¿Eliminar esta foto?')) return;
                              try {
                                await eliminarFoto(f.id);
                                cargarTodasFotos();
                              } catch {
                                console.error('Error al eliminar foto');
                              }
                            }}
                          />
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          )}

          {fotoTab === 'subir' && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Select
                  value={entidadFotos}
                  onChange={(e) => {
                    setEntidadFotos(e.target.value as typeof entidadFotos);
                    setEntidadFotosId(0);
                    setFotosSubidas([]);
                  }}
                  size="small"
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="accesion">Accesiones</MenuItem>
                  <MenuItem value="enfermedad">Enfermedades</MenuItem>
                  <MenuItem value="producto">Productos</MenuItem>
                </Select>
                {entidadFotos === 'accesion' && (
                  <Select
                    value={entidadFotosId}
                    onChange={(e) => setEntidadFotosId(Number(e.target.value))}
                    size="small"
                    sx={{ minWidth: 240 }}
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
                )}
                {entidadFotos === 'enfermedad' && (
                  <Select
                    value={entidadFotosId}
                    onChange={(e) => setEntidadFotosId(Number(e.target.value))}
                    size="small"
                    sx={{ minWidth: 240 }}
                    displayEmpty
                  >
                    <MenuItem value={0} disabled>
                      Seleccionar enfermedad...
                    </MenuItem>
                    {enfermedades.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.nombre_cientifico} — {e.nombre_comun}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {entidadFotos === 'producto' && (
                  <Select
                    value={entidadFotosId}
                    onChange={(e) => setEntidadFotosId(Number(e.target.value))}
                    size="small"
                    sx={{ minWidth: 240 }}
                    displayEmpty
                  >
                    <MenuItem value={0} disabled>
                      Seleccionar producto...
                    </MenuItem>
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre} ({p.tipo})
                      </MenuItem>
                    ))}
                  </Select>
                )}
                {entidadFotosId > 0 && (
                  <Button variant="outlined" size="small" onClick={cargarFotos}>
                    Ver fotos
                  </Button>
                )}
              </Box>
              {entidadFotosId > 0 && (
                <>
                  <SubirFoto
                    key={`${entidadFotos}-${entidadFotosId}`}
                    entidadTipo={entidadFotos}
                    entidadId={entidadFotosId}
                    onSubida={() => {
                      cargarFotos();
                      cargarTodasFotos();
                    }}
                  />
                  {fotosSubidas.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                      {fotosSubidas.map((f) => (
                        <Paper key={f.id} variant="outlined" sx={{ width: 180, p: 1 }}>
                          <img
                            src={`/${f.url}`}
                            alt={f.descripcion || ''}
                            style={{
                              width: '100%',
                              height: 110,
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                          {editandoId === f.id ? (
                            <Box sx={{ mt: 1 }}>
                              <TextField
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder="Descripción"
                              />
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={async () => {
                                    try {
                                      await actualizarFoto(f.id, editDesc);
                                      setEditandoId(null);
                                      cargarFotos();
                                    } catch {
                                      console.error('Error al actualizar foto');
                                    }
                                  }}
                                >
                                  Guardar
                                </Button>
                                <Button size="small" onClick={() => setEditandoId(null)}>
                                  Cancelar
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block' }}
                              >
                                {f.descripcion || 'Sin descripción'}
                              </Typography>
                              <EditDeleteActions
                                onEdit={() => {
                                  setEditandoId(f.id);
                                  setEditDesc(f.descripcion || '');
                                }}
                                onDelete={async () => {
                                  if (!confirm('¿Eliminar esta foto?')) return;
                                  try {
                                    await eliminarFoto(f.id);
                                    cargarFotos();
                                  } catch {
                                    console.error('Error al eliminar foto');
                                  }
                                }}
                              />
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Paper>
          )}
        </>
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

      {/* Dialog Crear/Editar Noticia */}
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

      {/* Dialog Crear/Editar Enfermedad */}
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

      {/* Dialog Crear/Editar Producto */}
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
                label="Tipo"
                value={prodForm.tipo}
                onChange={(e) => setProdForm({ ...prodForm, tipo: e.target.value })}
                size="small"
                sx={{ minWidth: 160 }}
                placeholder="pulpa, harina, aceite"
              />
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
    </Container>
  );
};

export default Admin;
