import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CuentaAgricultor from './CuentaAgricultor';

const mockLoginUser = vi.fn();
const mockRegisterUser = vi.fn();
const mockLogoutUser = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    loginUser: mockLoginUser,
    registerUser: mockRegisterUser,
    logoutUser: mockLogoutUser,
    user: null,
    isAuth: false,
    loading: false,
  }),
}));

// Mock AgricultorSolicitudes since it makes API calls
vi.mock('./AgricultorSolicitudes', () => ({
  default: () => null,
}));

const theme = createTheme();

function renderWithProviders() {
  return render(
    <ThemeProvider theme={theme}>
      <CuentaAgricultor />
    </ThemeProvider>,
  );
}

describe('CuentaAgricultor — Línea Gráfica Pitahaya', () => {
  it('renders "Ingresar" login button with secondary color', () => {
    renderWithProviders();
    const btn = screen.getByRole('button', { name: 'Ingresar' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-colorSecondary');
    expect(btn.className).not.toContain('MuiButton-colorPrimary');
  });

  it('renders "Crear cuenta" button with secondary color after switching to register tab', () => {
    renderWithProviders();
    // Click "Registrarse" tab
    const registerTab = screen.getByRole('tab', { name: 'Registrarse' });
    fireEvent.click(registerTab);

    const btn = screen.getByRole('button', { name: 'Crear cuenta' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-colorSecondary');
    expect(btn.className).not.toContain('MuiButton-colorPrimary');
  });
});
