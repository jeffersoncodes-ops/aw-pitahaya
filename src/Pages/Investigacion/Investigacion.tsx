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
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Alert,
} from '@mui/material';
import { listarAccesiones, type AccesionResumen } from '../../services/api';
import Buscador from '../../components/Buscador';

interface Deteccion {
  id: number;
  codigo_accesion: string;
  enfermedad: string;
  nivel_incidencia: string;
  metodo_deteccion: string;
  fecha_deteccion: string;
  provincia: string;
  variedad: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Investigacion = () => {
  const [tab, setTab] = useState(0);
  const [accesiones, setAccesiones] = useState<AccesionResumen[]>([]);
  const [detecciones, setDetecciones] = useState<Deteccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [descargando, setDescargando] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      listarAccesiones(),
      fetch('/api/detecciones.php')
        .then((r) => r.json())
        .catch(() => []),
    ])
      .then(([acc, det]) => {
        setAccesiones(acc);
        setDetecciones(det);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Datos de Investigación
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Detecciones" />
        <Tab label="Accesiones" />
        <Tab label="Buscar" />
        <Tab label="Descargar Datos" />
      </Tabs>

      {/* TAB 1: Detecciones */}
      <TabPanel value={tab} index={0}>
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Enfermedad</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Accesión</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Provincia</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Variedad</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Incidencia</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Método</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detecciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Sin detecciones registradas
                  </TableCell>
                </TableRow>
              ) : (
                detecciones.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>{d.enfermedad}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{d.codigo_accesion}</TableCell>
                    <TableCell>{d.provincia}</TableCell>
                    <TableCell>
                      <Chip
                        label={d.variedad}
                        size="small"
                        color={d.variedad === 'roja' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={d.nivel_incidencia}
                        size="small"
                        color={
                          d.nivel_incidencia === 'alto'
                            ? 'error'
                            : d.nivel_incidencia === 'medio'
                              ? 'warning'
                              : 'success'
                        }
                      />
                    </TableCell>
                    <TableCell>{d.metodo_deteccion}</TableCell>
                    <TableCell>{d.fecha_deteccion}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* TAB 2: Accesiones */}
      <TabPanel value={tab} index={1}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 2,
          }}
        >
          {accesiones.map((a) => (
            <Card key={a.codigo_accesion} elevation={2}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                >
                  {a.codigo_accesion}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {a.cropname} —{' '}
                  <i>
                    {a.genus} {a.species}
                  </i>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip
                    label={a.variedad}
                    size="small"
                    color={a.variedad === 'roja' ? 'error' : 'warning'}
                  />
                  <Chip label={a.provincia} size="small" variant="outlined" />
                  <Chip label={`${a.elevation} msnm`} size="small" variant="outlined" />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Coordenadas: {a.latitude}, {a.longitude}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>

      {/* TAB 3: Buscar */}
      <TabPanel value={tab} index={2}>
        <Buscador />
      </TabPanel>

      {/* TAB 4: Descargar Datos */}
      <TabPanel value={tab} index={3}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Exportar Datos para Investigación
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Descargá los datasets completos en formato CSV. Todos los archivos incluyen BOM UTF-8
            para compatibilidad con Excel.
          </Typography>

          {descargando && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Descargando {descargando}...
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Card elevation={2} sx={{ flex: '1 1 280px' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom={true}>
                  📋 Accesiones
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Datos completos de pasaporte: código, taxonomía, coordenadas, técnico responsable
                  y más.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={descargando !== null}
                  onClick={() => {
                    setDescargando('accesiones');
                    const a = document.createElement('a');
                    a.href = '/api/exportar.php?tipo=accesiones';
                    a.download = 'accesiones.csv';
                    a.click();
                    setTimeout(() => setDescargando(null), 2000);
                  }}
                >
                  Descargar CSV
                </Button>
              </CardContent>
            </Card>

            <Card elevation={2} sx={{ flex: '1 1 280px' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom={true}>
                  🔬 Detecciones
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Resultados de laboratorio: enfermedad detectada, nivel de incidencia, método y
                  fecha.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#2E7D32' }}
                  disabled={descargando !== null}
                  onClick={() => {
                    setDescargando('detecciones');
                    const a = document.createElement('a');
                    a.href = '/api/exportar.php?tipo=detecciones';
                    a.download = 'detecciones.csv';
                    a.click();
                    setTimeout(() => setDescargando(null), 2000);
                  }}
                >
                  Descargar CSV
                </Button>
              </CardContent>
            </Card>

            <Card elevation={2} sx={{ flex: '1 1 280px' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom={true}>
                  🦠 Enfermedades
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Catálogo de fitopatógenos con síntomas, condiciones de propagación y tratamientos.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#1565C0' }}
                  disabled={descargando !== null}
                  onClick={() => {
                    setDescargando('enfermedades');
                    const a = document.createElement('a');
                    a.href = '/api/exportar.php?tipo=enfermedades';
                    a.download = 'enfermedades.csv';
                    a.click();
                    setTimeout(() => setDescargando(null), 2000);
                  }}
                >
                  Descargar CSV
                </Button>
              </CardContent>
            </Card>

            <Card elevation={2} sx={{ flex: '1 1 280px' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} gutterBottom={true}>
                  🥫 Productos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Productos procesados de pitahaya: descripción, ingredientes y proceso de
                  obtención.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#E65100' }}
                  disabled={descargando !== null}
                  onClick={() => {
                    setDescargando('productos');
                    const a = document.createElement('a');
                    a.href = '/api/exportar.php?tipo=productos';
                    a.download = 'productos.csv';
                    a.click();
                    setTimeout(() => setDescargando(null), 2000);
                  }}
                >
                  Descargar CSV
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </TabPanel>
    </Container>
  );
};

export default Investigacion;
