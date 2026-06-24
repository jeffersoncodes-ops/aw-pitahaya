import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  type AccesionResumen,
  type EnfermedadResumen,
  type Foto,
  type ProductoResumen,
  listarFotos,
  listarAccesiones,
  listarEnfermedadesResumen,
  listarProductos,
  actualizarFoto,
  eliminarFoto,
} from '../../services/api';
import SubirFoto from '../../components/SubirFoto';
import {
  SectionHeader,
  TabButton,
  EditDeleteActions,
} from '../../components/AdminUI';
import { useNotificar } from '../../components/Notificacion';
import { getImageUrl } from '../../config/constants';

const AdminFotos = () => {
  const { notificar } = useNotificar();
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

  const cargarFotos = () => {
    if (!entidadFotosId) return;
    listarFotos(entidadFotos, entidadFotosId)
      .then(setFotosSubidas)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar fotos', 'error'));
  };

  const cargarTodasFotos = () => {
    listarFotos()
      .then(setTodasFotos)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar fotos', 'error'));
  };

  useEffect(() => {
    listarAccesiones()
      .then(setAccesiones)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar accesiones', 'error'));
    listarEnfermedadesResumen()
      .then(setEnfermedades)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar enfermedades', 'error'));
    listarProductos()
      .then(setProductos)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar productos', 'error'));
    cargarTodasFotos();
  }, []);

  return (
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
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: 1,
                      bgcolor: '#1a1a1a',
                      backgroundImage: `url(${getImageUrl(f.url)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
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
                            } catch (err: unknown) {
                              notificar(err instanceof Error ? err.message : 'Error al actualizar foto', 'error');
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
                          } catch (err: unknown) {
                            notificar(err instanceof Error ? err.message : 'Error al eliminar foto', 'error');
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
                      <Box
                        sx={{
                          width: '100%',
                          aspectRatio: '4/3',
                          borderRadius: 1,
                          bgcolor: '#1a1a1a',
                          backgroundImage: `url(${getImageUrl(f.url)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
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
                                } catch (err: unknown) {
                                  notificar(err instanceof Error ? err.message : 'Error al actualizar foto', 'error');
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
                            } catch (err: unknown) {
                              notificar(err instanceof Error ? err.message : 'Error al eliminar foto', 'error');
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
  );
};

export default AdminFotos;
