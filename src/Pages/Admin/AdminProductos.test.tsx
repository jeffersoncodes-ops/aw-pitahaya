import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '../../test/test-utils';
import { render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import AdminProductos from './AdminProductos';

const mockListarProductos = vi.hoisted(() => vi.fn());
const mockCrearProducto = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarProductos: mockListarProductos,
  crearProducto: mockCrearProducto,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockListarProductos.mockResolvedValue([]);
});

describe('AdminProductos', () => {
  it('renders section title and create button', async () => {
    render(<AdminProductos />);
    await waitFor(() => expect(mockListarProductos).toHaveBeenCalled());
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('+ Nuevo Producto')).toBeInTheDocument();
  });

  it('calls notificar with error on mount failure', async () => {
    mockListarProductos.mockRejectedValue(new Error('Error al cargar productos'));
    render(<AdminProductos />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Error al cargar productos');
  });

  it('calls notificar with success on create', async () => {
    mockCrearProducto.mockResolvedValue({ success: true, id: 1 });
    const user = userEvent.setup();
    render(<AdminProductos />);
    await waitFor(() => expect(mockListarProductos).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nuevo Producto'));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Nombre *'), 'Mermelada');
    await user.click(screen.getByText('Crear'));

    await waitFor(() => expect(mockCrearProducto).toHaveBeenCalled());
    expect(await screen.findByRole('alert')).toHaveTextContent('Producto creado correctamente');
  });

  it('calls notificar with error on create API failure', async () => {
    mockCrearProducto.mockRejectedValue(new Error('Error al guardar'));
    const user = userEvent.setup();
    render(<AdminProductos />);
    await waitFor(() => expect(mockListarProductos).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nuevo Producto'));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Nombre *'), 'Mermelada');
    await user.click(screen.getByText('Crear'));

    expect(await screen.findByText('Error al guardar')).toBeInTheDocument();
  });
}, 15000);
