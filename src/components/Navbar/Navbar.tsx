import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';

import pitahayaRoja from '../../assets/navbar/pitahaya-roja.png';

interface NavbarProps {
  isAuth?: boolean;
  userName?: string;
  userRol?: string;
  onLogout?: () => void;
}

const Navbar = ({ isAuth, userName, userRol, onLogout }: NavbarProps) => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'primary.main',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', position: 'relative', minHeight: 64 }}>
        <Box
          component="img"
          src={pitahayaRoja}
          alt="Pitahaya roja"
          sx={{ height: 56, position: 'absolute', left: 16, borderRadius: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            sx={{
              mx: 1,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Inicio
          </Button>
          <Button
            component={RouterLink}
            to="/investigacion"
            variant="outlined"
            sx={{
              mx: 1,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Investigación
          </Button>
          <Button
            component={RouterLink}
            to="/noticias"
            variant="outlined"
            sx={{
              mx: 1,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Noticias
          </Button>
          <Button
            component={RouterLink}
            to="/catalogos"
            variant="outlined"
            sx={{
              mx: 1,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Catálogos
          </Button>
          <Button
            component={RouterLink}
            to="/admin"
            variant="outlined"
            sx={{
              mx: 1,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Admin
          </Button>

          {isAuth && (
            <>
              <Chip
                label={`${userName} (${userRol})`}
                size="small"
                sx={{
                  ml: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />
              <Button
                onClick={onLogout}
                variant="outlined"
                size="small"
                sx={{
                  ml: 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.15)' },
                }}
              >
                Salir
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export { Navbar };
