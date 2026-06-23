import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '../../test/test-utils';
import { render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import AdminEnfermedades from './AdminEnfermedades';

const mockListarEnfermedadesAdmin = vi.hoisted(() => vi.fn());
const mockCrearEnfermedad = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarEnfermedadesAdmin: mockListarEnfermedadesAdmin,
  crearEnfermedad: mockCrearEnfermedad,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockListarEnfermedadesAdmin.mockResolvedValue([]);
});

describe('AdminEnfermedades', () => {
  it('renders section title and create button', async () => {
    render(<AdminEnfermedades />);
    await waitFor(() => expect(mockListarEnfermedadesAdmin).toHaveBeenCalled());
    expect(screen.getByText('Enfermedades')).toBeInTheDocument();
    expect(screen.getByText('+ Nueva Enfermedad')).toBeInTheDocument();
  });

  it('calls notificar with error on mount failure', async () => {
    mockListarEnfermedadesAdmin.mockRejectedValue(new Error('Error al cargar enfermedades'));
    render(<AdminEnfermedades />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Error al cargar enfermedades');
  });

  it('calls notificar with success on create', async () => {
    mockCrearEnfermedad.mockResolvedValue({ success: true, id: 1 });
    const user = userEvent.setup();
    render(<AdminEnfermedades />);
    await waitFor(() => expect(mockListarEnfermedadesAdmin).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nueva Enfermedad'));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Nombre científico *'), 'Fusarium');
    await user.click(screen.getByText('Crear'));

    await waitFor(() => expect(mockCrearEnfermedad).toHaveBeenCalled());
    expect(await screen.findByRole('alert')).toHaveTextContent('Enfermedad creada correctamente');
  });

  it('calls notificar with error on create API failure', async () => {
    mockCrearEnfermedad.mockRejectedValue(new Error('Error al guardar'));
    const user = userEvent.setup();
    render(<AdminEnfermedades />);
    await waitFor(() => expect(mockListarEnfermedadesAdmin).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nueva Enfermedad'));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Nombre científico *'), 'Fusarium');
    await user.click(screen.getByText('Crear'));

    expect(await screen.findByText('Error al guardar')).toBeInTheDocument();
  });
}, 15000);
