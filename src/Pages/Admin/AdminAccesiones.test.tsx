import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '../../test/test-utils';
import { render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import AdminAccesiones from './AdminAccesiones';

const mockListarAccesiones = vi.hoisted(() => vi.fn());
const mockListarTecnicos = vi.hoisted(() => vi.fn());
const mockListarPropietarios = vi.hoisted(() => vi.fn());
const mockListarDonantes = vi.hoisted(() => vi.fn());
const mockCrearAccesion = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarAccesiones: mockListarAccesiones,
  listarTecnicos: mockListarTecnicos,
  listarPropietarios: mockListarPropietarios,
  listarDonantes: mockListarDonantes,
  crearAccesion: mockCrearAccesion,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockListarAccesiones.mockResolvedValue([]);
  mockListarTecnicos.mockResolvedValue([]);
  mockListarPropietarios.mockResolvedValue([]);
  mockListarDonantes.mockResolvedValue([]);
});

describe('AdminAccesiones', () => {
  it('renders section title and create button', async () => {
    render(<AdminAccesiones />);

    await waitFor(() => {
      expect(mockListarAccesiones).toHaveBeenCalled();
    });

    expect(screen.getByText('Accesiones')).toBeInTheDocument();
    expect(screen.getByText('+ Nueva Accesión')).toBeInTheDocument();
  });

  it('calls notificar with error when listarAccesiones fails', async () => {
    mockListarAccesiones.mockRejectedValue(
      new Error('Error al cargar accesiones'),
    );

    render(<AdminAccesiones />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error al cargar accesiones',
    );
  });

  it('validation shows warning when creating with empty required fields', async () => {
    const user = userEvent.setup();
    render(<AdminAccesiones />);
    await waitFor(() => expect(mockListarAccesiones).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nueva Accesión'));
    await screen.findByRole('dialog');
    await user.click(screen.getByText('Crear'));

    expect(await screen.findByText('Completa los campos requeridos: Código, Técnico y Propietario')).toBeInTheDocument();
  });

  it('calls notificar with error on create API failure', async () => {
    mockCrearAccesion.mockRejectedValue(new Error('Error del servidor'));
    mockListarTecnicos.mockResolvedValue([{ id: 1, nombre: 'Carlos', correo: null, cargo: null }]);
    mockListarPropietarios.mockResolvedValue([{ id: 1, nombre_productor: 'Maria', cedula: null, celular: null, nombre_finca: null }]);

    const user = userEvent.setup();
    render(<AdminAccesiones />);
    await waitFor(() => expect(mockListarAccesiones).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nueva Accesión'));
    await screen.findByRole('dialog');

    // Fill codigo field
    await user.type(screen.getByLabelText('Código *'), 'TEST-002');

    // Select técnico via combobox
    const combos = screen.getAllByRole('combobox');
    await user.click(combos[0]);
    await user.click(screen.getByText('Carlos'));

    await user.click(combos[1]);
    await user.click(screen.getByText('Maria'));

    await user.click(screen.getByText('Crear'));

    expect(await screen.findByText('Error del servidor')).toBeInTheDocument();
  });
}, 15000);
