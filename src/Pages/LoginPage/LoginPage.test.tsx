import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './LoginPage';

const mockLoginUser = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    loginUser: mockLoginUser,
    user: null,
    isAuth: false,
    loading: false,
  }),
}));

const theme = createTheme();

function renderWithProviders() {
  return render(
    <ThemeProvider theme={theme}>
      <LoginPage />
    </ThemeProvider>,
  );
}

describe('LoginPage — Línea Gráfica Pitahaya', () => {
  it('renders "Administración" header with variant h5', () => {
    renderWithProviders();
    const header = screen.getByText('Administración');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('H5');
  });

  it('has submit button "Ingresar" with secondary color', () => {
    renderWithProviders();
    const btn = screen.getByRole('button', { name: 'Ingresar' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-colorSecondary');
    expect(btn.className).not.toContain('MuiButton-colorPrimary');
  });

  describe('inline validation', () => {
    function getEmailInput() {
      return screen.getByRole('textbox', { name: /email/i });
    }

    function getPasswordInput() {
      return screen.getByLabelText(/^Contraseña/);
    }

    it('shows email error on blur when empty', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(getEmailInput());
      await user.tab(); // blur without typing

      await waitFor(() => {
        expect(screen.getByText('El correo electrónico es obligatorio')).toBeInTheDocument();
      });
    });

    it('shows email error on blur when invalid format', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(getEmailInput());
      await user.keyboard('invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Correo electrónico no válido')).toBeInTheDocument();
      });
    });

    it('shows password error on blur when empty', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(getPasswordInput());
      await user.tab(); // blur without typing

      await waitFor(() => {
        expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
      });
    });

    it('shows password error on blur when too short', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(getPasswordInput());
      await user.keyboard('abc');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      });
    });

    it('blocks submit with empty fields and shows errors', async () => {
      renderWithProviders();

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('El correo electrónico es obligatorio')).toBeInTheDocument();
      });
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
    });

    it('does NOT show inline errors when fields are valid on blur', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(getEmailInput());
      await user.keyboard('admin@test.com');
      await user.tab();

      await user.click(getPasswordInput());
      await user.keyboard('123456');
      await user.tab();

      expect(screen.queryByText('El correo electrónico es obligatorio')).not.toBeInTheDocument();
      expect(screen.queryByText('La contraseña es obligatoria')).not.toBeInTheDocument();
      expect(screen.queryByText('Correo electrónico no válido')).not.toBeInTheDocument();
      expect(screen.queryByText('La contraseña debe tener al menos 6 caracteres')).not.toBeInTheDocument();
    });
  });
});
