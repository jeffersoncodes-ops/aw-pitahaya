import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AgricultorSolicitudes from './AgricultorSolicitudes';

interface CuentaAgricultorProps {
  onLoginSuccess?: () => void;
}

const CuentaAgricultor = ({ onLoginSuccess }: CuentaAgricultorProps) => {
  const { loginUser, registerUser, user, isAuth, logoutUser } = useAuth();
  const [tab, setTab] = useState(0);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registro
  const [reg, setReg] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    finca: '',
    direccion: '',
  });
  const [regError, setRegError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      await loginUser(loginEmail, loginPass);
      onLoginSuccess?.();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (reg.password.length < 6) {
      setRegError('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await registerUser(reg);
      onLoginSuccess?.();
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const [subtab, setSubtab] = useState(0);

  if (isAuth && user?.rol === 'agricultor') {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {user.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email} {user.finca ? `— ${user.finca}` : ''}
            </Typography>
          </Box>
          <Button variant="outlined" size="small" onClick={logoutUser}>
            Cerrar sesion
          </Button>
        </Box>

        <Tabs
          value={subtab}
          onChange={(_, v) => setSubtab(v)}
          sx={{ mb: 2 }}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Mi Perfil" />
          <Tab label="Mis Solicitudes" />
        </Tabs>

        {subtab === 0 && (
          <Alert severity="success">
            Sesion iniciada como Agricultor — tus datos se autocompletaran en el formulario de
            solicitud.
          </Alert>
        )}

        {subtab === 1 && <AgricultorSolicitudes />}
      </Paper>
    );
  }

  if (isAuth) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user?.nombre} ({user?.rol})
          </Typography>
          <Button variant="outlined" size="small" onClick={logoutUser}>
            Cerrar sesion
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Iniciar sesion" />
        <Tab label="Registrarse" />
      </Tabs>

      {tab === 0 && (
        <Box component="form" onSubmit={handleLogin}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          <TextField
            label="Email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contrasena"
            type="password"
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </Button>
        </Box>
      )}

      {tab === 1 && (
        <Box component="form" onSubmit={handleRegistro}>
          {regError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {regError}
            </Alert>
          )}
          <TextField
            label="Nombre completo"
            value={reg.nombre}
            onChange={(e) => setReg({ ...reg, nombre: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            value={reg.email}
            onChange={(e) => setReg({ ...reg, email: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contrasena (min 6 caracteres)"
            type="password"
            value={reg.password}
            onChange={(e) => setReg({ ...reg, password: e.target.value })}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Telefono"
            value={reg.telefono}
            onChange={(e) => setReg({ ...reg, telefono: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nombre de la finca"
            value={reg.finca}
            onChange={(e) => setReg({ ...reg, finca: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Direccion"
            value={reg.direccion}
            onChange={(e) => setReg({ ...reg, direccion: e.target.value })}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CuentaAgricultor;
