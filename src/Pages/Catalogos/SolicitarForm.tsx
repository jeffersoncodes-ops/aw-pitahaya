import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';

import { listarAccesiones, solicitarSemillas, type AccesionResumen } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UNIDADES = ['kg', 'lb', 'g', 'oz', 'unidad', 'lote'];

interface Item {
  accesion_id: number;
  cantidad: number;
  unidad: string;
}

const estadoVacio = { nombre: '', email: '', telefono: '', cedula: '', finca: '', direccion: '' };

const SolicitarForm = () => {
  const { user, isAuth, esAgricultor } = useAuth();
  const [form, setForm] = useState(() => {
    if (isAuth && esAgricultor && user) {
      return {
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        cedula: user.cedula || '',
        finca: user.finca || '',
        direccion: user.direccion || '',
      };
    }
    return estadoVacio;
  });
  const [items, setItems] = useState<Item[]>([{ accesion_id: 0, cantidad: 1, unidad: 'kg' }]);
  const [accesiones, setAccesiones] = useState<AccesionResumen[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{
    ok: boolean;
    msg: string;
    tracking?: string;
  } | null>(null);

  useEffect(() => {
    listarAccesiones()
      .then(setAccesiones)
      .catch(() => {});
  }, []);

  const cambiarCampo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cambiarItem = (idx: number, campo: keyof Item, valor: number | string) => {
    const nuevos = [...items];
    nuevos[idx] = { ...nuevos[idx], [campo]: valor };
    setItems(nuevos);
  };

  const agregarItem = () => setItems([...items, { accesion_id: 0, cantidad: 1, unidad: 'kg' }]);
  const quitarItem = (idx: number) =>
    items.length > 1 && setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setResultado(null);

    try {
      const res = await solicitarSemillas({
        ...form,
        items: items
          .filter((i) => i.accesion_id > 0)
          .map((i) => ({ accesion_id: i.accesion_id, cantidad: i.cantidad, unidad: i.unidad })),
      });
      setResultado({ ok: true, msg: res.mensaje, tracking: res.numero_seguimiento });
      setForm(estadoVacio);
      setItems([{ accesion_id: 0, cantidad: 1, unidad: 'kg' }]);
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
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Cédula"
            name="cedula"
            value={form.cedula}
            onChange={cambiarCampo}
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
        Semillas Solicitadas
      </Typography>

      {items.map((item, idx) => (
        <Paper
          key={idx}
          variant="outlined"
          sx={{ p: 2, mb: 1, display: 'flex', gap: 2, alignItems: 'center' }}
        >
          <TextField
            select
            label="Accesión"
            value={item.accesion_id}
            onChange={(e) => cambiarItem(idx, 'accesion_id', Number(e.target.value))}
            sx={{ minWidth: 280 }}
            size="small"
          >
            <MenuItem value={0}>Seleccionar...</MenuItem>
            {accesiones.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.codigo_accesion} — {a.cropname} ({a.variedad})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Cantidad"
            type="number"
            value={item.cantidad}
            onChange={(e) => cambiarItem(idx, 'cantidad', Math.max(1, Number(e.target.value)))}
            slotProps={{ htmlInput: { min: 1 } }}
            sx={{ width: 90 }}
            size="small"
          />
          <TextField
            select
            label="Unidad"
            value={item.unidad}
            onChange={(e) => cambiarItem(idx, 'unidad', e.target.value)}
            sx={{ width: 110 }}
            size="small"
          >
            {UNIDADES.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </TextField>
          <Button
            color="error"
            size="small"
            onClick={() => quitarItem(idx)}
            disabled={items.length === 1}
          >
            Quitar
          </Button>
        </Paper>
      ))}

      <Button onClick={agregarItem} size="small" sx={{ mb: 3 }}>
        Agregar otra semilla
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
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
