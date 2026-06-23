import { useState, useEffect } from 'react';
import { Container, Typography, Tabs, Tab } from '@mui/material';
import AdminDashboard from './AdminDashboard';
import AdminAccesiones from './AdminAccesiones';
import AdminEnfermedades from './AdminEnfermedades';
import AdminProductos from './AdminProductos';
import AdminNoticias from './AdminNoticias';
import AdminFotos from './AdminFotos';

const Admin = () => {
  const [adminTab, setAdminTab] = useState(0);

  useEffect(() => {
    document.title = 'Pitahaya — Administración';
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="fade-in-page">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }} color="primary">
        Panel de Administración
      </Typography>

      <Tabs
        value={adminTab}
        onChange={(_, v) => setAdminTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Dashboard" />
        <Tab label="Accesiones" />
        <Tab label="Enfermedades" />
        <Tab label="Productos" />
        <Tab label="Noticias" />
        <Tab label="Fotos" />
      </Tabs>

      {adminTab === 0 && <AdminDashboard />}
      {adminTab === 1 && <AdminAccesiones />}
      {adminTab === 2 && <AdminEnfermedades />}
      {adminTab === 3 && <AdminProductos />}
      {adminTab === 4 && <AdminNoticias />}
      {adminTab === 5 && <AdminFotos />}
    </Container>
  );
};

export default Admin;
