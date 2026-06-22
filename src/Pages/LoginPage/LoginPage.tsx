import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_CREDENTIALS } from '../../config/constants';
import { validateLoginEmail, validatePassword, validateLoginForm } from './loginValidation';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Pitahaya — Ingresar';
  }, []);

  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleBlurEmail = useCallback(() => {
    const err = validateLoginEmail(email);
    setFieldErrors((prev) => ({ ...prev, email: err }));
  }, [email]);

  const handleBlurPassword = useCallback(() => {
    const err = validatePassword(password);
    setFieldErrors((prev) => ({ ...prev, password: err }));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      await loginUser(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }} className="fade-in-page">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Administración
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingrese sus credenciales
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlurEmail}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email || ' '}
            fullWidth
            required
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleBlurPassword}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password || ' '}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            color="secondary"
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
