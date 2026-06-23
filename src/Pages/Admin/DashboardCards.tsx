import { Card, CardContent, Typography, Box } from '@mui/material';
import type { AdminResumen } from '../../services/api';

interface DashboardCardsProps {
  totals: AdminResumen['totals'] | undefined;
}

function DashboardCards({ totals: t }: DashboardCardsProps) {
  return (
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
  );
}

export default DashboardCards;
