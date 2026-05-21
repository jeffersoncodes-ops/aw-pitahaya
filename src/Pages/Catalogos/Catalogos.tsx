import { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import AccesionesTable from './AccesionesTable';
import EnfermedadesList from './EnfermedadesList';
import ProductosGrid from './ProductosGrid';
import Buscador from '../../components/Buscador';
import SolicitarForm from './SolicitarForm';

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

const Catalogos = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
      >
        <Tab label="Semillas" />
        <Tab label="Enfermedades" />
        <Tab label="Productos" />
        <Tab label="Buscar" />
        <Tab label="Solicitar" />
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
    </Container>
  );
};

export default Catalogos;
