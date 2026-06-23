import { useState, useEffect } from 'react';
import { Container, Typography, Tabs, Tab } from '@mui/material';
import AccesionesTable from './AccesionesTable';
import EnfermedadesList from './EnfermedadesList';
import ProductosGrid from './ProductosGrid';
import Buscador from '../../components/Buscador';
import SolicitarForm from './SolicitarForm';
import CuentaAgricultor from './CuentaAgricultor';
import TabPanel from '@/components/TabPanel';

const Catalogos = () => {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    document.title = 'Pitahaya — Catálogos';
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="fade-in-page">
      <Typography variant="h4" gutterBottom color="primary">
        Catálogos
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        textColor="secondary"
        indicatorColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <Tab label="Semillas" />
        <Tab label="Enfermedades" />
        <Tab label="Productos" />
        <Tab label="Buscar" />
        <Tab label="Solicitar" />
        <Tab label="Mi Cuenta" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <AccesionesTable />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <EnfermedadesList />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <ProductosGrid />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Buscador />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <SolicitarForm />
      </TabPanel>
      <TabPanel value={tab} index={5}>
        <CuentaAgricultor />
      </TabPanel>
    </Container>
  );
};

export default Catalogos;
