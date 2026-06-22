import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import {
  listarInventarioDisponible,
  solicitarSemillas,
  type InventarioDisponible,
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotificar } from '../../components/Notificacion';
import {
  validateNombre,
  validateEmail,
  validateTelefono,
  validateSolicitarForm,
} from './solicitarFormValidation';

const estadoVacio = { nombre: '', email: '', telefono: '', finca: '', direccion: '' };

const SolicitarForm = () => {
  const { user, isAuth, esAgricultor } = useAuth();
  const { notificar } = useNotificar();
  const [form, setForm] = useState(() => {
    if (isAuth && esAgricultor && user) {
      return {
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        finca: user.finca || '',
        direccion: user.direccion || '',
      };
    }
    return estadoVacio;
  });
  const [disponibles, setDisponibles] = useState<InventarioDisponible[]>([]);
  const [cantidades, setCantidades] = useState<Record<string, string>>({});
  const [unidades, setUnidades] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{
    ok: boolean;
    msg: string;
    tracking?: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    listarInventarioDisponible()
      .then(setDisponibles)
      .catch((err) =>
        notificar(err instanceof Error ? err.message : 'Error al cargar inventario', 'error'),
      );
  }, []);

  const cambiarCampo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cambiarCantidad = (accesionId: number, value: string) => {
    setCantidades((prev) => ({ ...prev, [String(accesionId)]: value }));
  };

  const cambiarUnidad = (accesionId: number, value: string) => {
    setUnidades((prev) => ({ ...prev, [String(accesionId)]: value }));
  };

  const handleBlur = useCallback(
    (field: 'nombre' | 'email' | 'telefono') => () => {
      let err: string | undefined;
      switch (field) {
        case 'nombre':
          err = validateNombre(form.nombre);
          break;
        case 'email':
          err = validateEmail(form.email);
          break;
        case 'telefono':
          err = validateTelefono(form.telefono);
          break;
      }
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next[field] = err;
        } else {
          delete next[field];
        }
        return next;
      });
    },
    [form.nombre, form.email, form.telefono],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    const validationErrors = validateSolicitarForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setEnviando(false);
      return;
    }

    // Construir items solo con cantidades > 0
    const items = Object.entries(cantidades)
      .map(([id, cant]) => ({ accesion_id: Number(id), cantidad: parseFloat(cant) }))
      .filter((i) => !isNaN(i.cantidad) && i.cantidad > 0);

    if (items.length === 0) {
      setResultado({ ok: false, msg: 'Debe solicitar al menos una semilla' });
      setEnviando(false);
      return;
    }

    // Validar contra stock disponible
    for (const item of items) {
      const inv = disponibles.find((d) => d.accesion_id === item.accesion_id);
      if (!inv || item.cantidad > inv.cantidad_disponible) {
        setResultado({
          ok: false,
          msg: `La cantidad solicitada para "${inv?.nombre_variedad ?? item.accesion_id}" excede el stock disponible (${inv?.cantidad_disponible ?? 0})`,
        });
        setEnviando(false);
        return;
      }
    }

    try {
      const res = await solicitarSemillas({
        ...form,
        items: items.map((i) => ({
          accesion_id: i.accesion_id,
          cantidad: i.cantidad,
          unidad: unidades[String(i.accesion_id)] ?? 'kg',
        })),
      });
      setResultado({ ok: true, msg: res.mensaje, tracking: res.numero_seguimiento });
      setForm(estadoVacio);
      setCantidades({});
    } catch (err: unknown) {
      setResultado({
        ok: false,
        msg: err instanceof Error ? err.message : 'Error al enviar solicitud',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {resultado && (
        <Alert
          severity={resultado.ok ? 'success' : 'error'}
          sx={{ mb: 3 }}
          onClose={() => setResultado(null)}
        >
          {resultado.ok ? (
            <>
              <strong>¡Solicitud creada!</strong> Tu número de seguimiento es{' '}
              <Chip
                label={resultado.tracking}
                size="small"
                color="success"
                sx={{ fontFamily: 'monospace' }}
              />
            </>
          ) : (
            resultado.msg
          )}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Tus Datos
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Nombre completo"
            name="nombre"
            value={form.nombre}
            onChange={cambiarCampo}
            onBlur={handleBlur('nombre')}
            error={!!errors.nombre}
            helperText={errors.nombre || ' '}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={cambiarCampo}
            onBlur={handleBlur('email')}
            error={!!errors.email}
            helperText={errors.email || ' '}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={cambiarCampo}
            onBlur={handleBlur('telefono')}
            error={!!errors.telefono}
            helperText={errors.telefono || ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Nombre de la finca"
            name="finca"
            value={form.finca}
            onChange={cambiarCampo}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={cambiarCampo}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Semillas Disponibles
      </Typography>

      {disponibles.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No hay semillas disponibles en este momento.
        </Typography>
      ) : (
        disponibles.map((item) => {
          const accesionId = item.accesion_id;
          const cantStr = cantidades[String(accesionId)] ?? '';
          const cantNum = parseFloat(cantStr);
          const excede = cantStr !== '' && (isNaN(cantNum) || cantNum > item.cantidad_disponible);

          return (
            <Paper
              key={accesionId}
              variant="outlined"
              sx={{ p: 2, mb: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.codigo_ubicacion} — {item.nombre_variedad}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Stock disponible: {item.cantidad_disponible} {item.unidad}
                    {' — '}Código: {item.codigo_accesion}
                  </Typography>
                </Box>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={cantStr}
                  onChange={(e) => cambiarCantidad(accesionId, e.target.value)}
                  error={excede}
                  helperText={excede ? `Máximo ${item.cantidad_disponible}` : ' '}
                  slotProps={{ htmlInput: { min: 0, max: item.cantidad_disponible } }}
                  sx={{ width: 110 }}
                  size="small"
                />
                <FormControl size="small" sx={{ width: 110 }}>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={unidades[String(accesionId)] ?? 'kg'}
                    label="Unidad"
                    onChange={(e) => cambiarUnidad(accesionId, e.target.value)}
                  >
                    <MenuItem value="kg">Kg</MenuItem>
                    <MenuItem value="lb">Lb</MenuItem>
                    <MenuItem value="g">Gramos</MenuItem>
                    <MenuItem value="oz">Onzas</MenuItem>
                    <MenuItem value="unidad">Unidad</MenuItem>
                    <MenuItem value="lote">Lote</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          );
        })
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={enviando}
          startIcon={enviando ? <CircularProgress size={20} color="inherit" /> : undefined}
          sx={{ px: 4 }}
        >
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </Box>
    </Box>
  );
};

export default SolicitarForm;
