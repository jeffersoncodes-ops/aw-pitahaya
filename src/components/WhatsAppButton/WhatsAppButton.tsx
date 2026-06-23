import { keyframes } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '../../config/constants';
import { useLocation } from 'react-router-dom';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

export function WhatsAppButton() {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 36,
        right: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        zIndex: 9999,
        animation: `${pulse} 2.5s ease-in-out infinite`,
        '&:hover': { animation: 'none', opacity: 1 },
      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          px: 2,
          py: 0.8,
          borderRadius: 2,
          boxShadow: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f0f0f0' },
        }}
        component="a"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
          ¿Necesita ayuda?
        </Typography>
      </Box>
      <Fab
        component="a"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bgcolor: '#25D366',
          color: 'white',
          '&:hover': { bgcolor: '#128C7E' },
          boxShadow: 3,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Box>
  );
}
