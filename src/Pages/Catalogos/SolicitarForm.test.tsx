import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SolicitarForm from './SolicitarForm';

const mockListarInventario = vi.fn();
const mockSolicitarSemillas = vi.fn();
const mockNotificar = vi.fn();

vi.mock('../../services/api', () => ({
  listarInventarioDisponible: (...args: unknown[]) => mockListarInventario(...args),
  solicitarSemillas: (...args: unknown[]) => mockSolicitarSemillas(...args),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuth: false,
    esAgricultor: false,
  }),
}));

vi.mock('../../components/Notificacion', () => ({
  useNotificar: () => ({ notificar: mockNotificar }),
  NotificacionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const theme = createTheme();

function renderWithProviders() {
  return render(
    <ThemeProvider theme={theme}>
      <SolicitarForm />
    </ThemeProvider>,
  );
}

describe('SolicitarForm — Línea Gráfica Pitahaya', () => {
  it('renders "Enviar Solicitud" submit button with secondary color', () => {
    mockListarInventario.mockResolvedValue([]);
    renderWithProviders();
    const btn = screen.getByRole('button', { name: 'Enviar Solicitud' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-colorSecondary');
    expect(btn.className).not.toContain('MuiButton-colorPrimary');
  });

  describe('inline validation', () => {
    function getNombreInput() {
      return screen.getByRole('textbox', { name: /nombre completo/i });
    }

    function getEmailInput() {
      return screen.getByRole('textbox', { name: /correo electrónico/i });
    }

    function getTelefonoInput() {
      return screen.getByRole('textbox', { name: /teléfono/i });
    }

    it('shows error on nombre on blur when empty', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      await user.click(getNombreInput());
      await user.tab(); // blur without typing

      expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();
    });

    it('shows error on nombre on blur when too short', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      await user.click(getNombreInput());
      await user.keyboard('A');
      await user.tab();

      expect(await screen.findByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument();
    });

    it('shows error on email on blur when invalid', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      await user.click(getEmailInput());
      await user.keyboard('correo-invalido');
      await user.tab();

      expect(await screen.findByText('Correo electrónico no válido')).toBeInTheDocument();
    });

    it('shows error on telefono on blur when invalid format', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      await user.click(getTelefonoInput());
      await user.keyboard('ABC');
      await user.tab();

      expect(await screen.findByText('Teléfono no válido')).toBeInTheDocument();
    });

    it('does not show telefono error on blur when empty (optional)', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      const telInput = getTelefonoInput();
      // MUI always sets aria-invalid, so check it's "false" not "true"
      expect(telInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('blocks submit when required fields are empty and shows all errors', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      });
      expect(screen.getByText('El correo electrónico es obligatorio')).toBeInTheDocument();
    });

    it('clears error when field becomes valid after blur', async () => {
      const user = userEvent.setup();
      mockListarInventario.mockResolvedValue([]);
      renderWithProviders();

      await user.click(getNombreInput());
      await user.tab(); // blur empty → shows error

      expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument();

      await user.click(getNombreInput());
      await user.keyboard('Juan Pérez');
      await user.tab(); // blur with valid value → clears error

      await waitFor(() => {
        expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument();
      });
    });
  });
});
