import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  type AdminResumen,
  type AccesionResumen,
  type SolicitudAdmin,
  adminResumen,
  listarSolicitudesAdmin,
  listarAccesiones,
} from '../../services/api';
import { useNotificar } from '../../components/Notificacion';
import DashboardCards from './DashboardCards';
import SolicitudesTable from './SolicitudesTable';
import InventarioTable from './InventarioTable';
import SkeletonCards from '../../components/SkeletonCards';

const AdminDashboard = () => {
  const [resumen, setResumen] = useState<AdminResumen | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificar } = useNotificar();
  const [accesiones, setAccesiones] = useState<AccesionResumen[]>([]);

  const cargarDatos = () => {
    setLoading(true);
    Promise.all([
      adminResumen()
        .then(setResumen)
        .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar resumen', 'error')),
      listarSolicitudesAdmin()
        .then(setSolicitudes)
        .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar solicitudes', 'error')),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
    listarAccesiones()
      .then(setAccesiones)
      .catch((err) => notificar(err instanceof Error ? err.message : 'Error al cargar accesiones', 'error'));
  }, []);

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <SkeletonCards count={3} />
      </Box>
    );
  }

  return (
    <>
      <DashboardCards totals={resumen?.totals} />
      <SolicitudesTable solicitudes={solicitudes} onRefresh={cargarDatos} />
      <InventarioTable
        inventario={resumen?.inventario || []}
        accesiones={accesiones}
        onRefresh={cargarDatos}
      />
    </>
  );
};

export default AdminDashboard;
