import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import pitahayaRoja from '../../assets/navbar/pitahaya-roja.png';

const NavButton = styled(Button)({
  mx: 1,
  color: 'white',
  borderColor: 'rgba(255, 255, 255, 0.5)',
  '&:hover': {
    borderColor: 'white',
    bgcolor: 'rgba(255, 255, 255, 0.1)',
  },
}) as typeof Button;

const paginas = [
  { label: 'Inicio', path: '/' },
  { label: 'Investigación', path: '/investigacion' },
  { label: 'Noticias', path: '/noticias' },
  { label: 'Catálogos', path: '/catalogos' },
  { label: 'Admin', path: '/admin' },
];

interface NavbarProps {
  isAuth?: boolean;
  userName?: string;
  userRol?: string;
  onLogout?: () => void;
}

const Navbar = ({ isAuth, userName, userRol, onLogout }: NavbarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navContent = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {paginas.map((p) => (
        <NavButton
          key={p.path}
          component={RouterLink}
          to={p.path}
          variant={location.pathname === p.path ? 'contained' : 'outlined'}
          sx={
            location.pathname === p.path
              ? { bgcolor: 'rgba(255,255,255,0.25)', borderColor: 'white' }
              : undefined
          }
        >
          {p.label}
        </NavButton>
      ))}

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
          <NavButton onClick={onLogout} variant="outlined" size="small">
            Salir
          </NavButton>
        </>
      )}
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'primary.main',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, justifyContent: { md: 'center' } }}>
        {/* Logo */}
        <Box
          component="img"
          src={pitahayaRoja}
          alt="Pitahaya roja"
          sx={{ height: { xs: 40, md: 56 }, mr: { xs: 'auto', md: 3 }, borderRadius: 1 }}
        />

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="Abrir menú"
              onClick={() => {
                setDrawerOpen(true);
                (document.activeElement as HTMLElement)?.blur();
              }}
              edge="end"
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              slotProps={{ backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.4)' } } }}
            >
              <Box sx={{ width: 280, bgcolor: 'primary.main', height: '100%', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
                  <Box
                    component="img"
                    src={pitahayaRoja}
                    alt="Pitahaya roja"
                    sx={{ height: 40, mr: 1, borderRadius: 1 }}
                  />
                  <Box sx={{ flex: 1 }} />
                  <IconButton color="inherit" onClick={() => setDrawerOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <List>
                  {paginas.map((p) => (
                    <ListItem key={p.path} disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={p.path}
                        selected={location.pathname === p.path}
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          color: 'white',
                          '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.2)' },
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                      >
                        <ListItemText
                          primary={p.label}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: location.pathname === p.path ? 'bold' : 'normal',
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                {isAuth && (
                  <>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Chip
                        label={`${userName} (${userRol})`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 'medium',
                          mb: 1,
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => {
                          onLogout?.();
                          setDrawerOpen(false);
                        }}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                      >
                        Cerrar sesión
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Drawer>
          </>
        ) : (
          navContent
        )}
      </Toolbar>
    </AppBar>
  );
};

export { Navbar };
