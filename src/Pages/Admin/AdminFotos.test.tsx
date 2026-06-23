import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '../../test/test-utils';
import { render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import AdminFotos from './AdminFotos';

const mockListarFotos = vi.hoisted(() => vi.fn());
const mockListarAccesiones = vi.hoisted(() => vi.fn());
const mockListarEnfermedadesResumen = vi.hoisted(() => vi.fn());
const mockListarProductos = vi.hoisted(() => vi.fn());
const mockActualizarFoto = vi.hoisted(() => vi.fn());
const mockEliminarFoto = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarFotos: mockListarFotos,
  listarAccesiones: mockListarAccesiones,
  listarEnfermedadesResumen: mockListarEnfermedadesResumen,
  listarProductos: mockListarProductos,
  actualizarFoto: mockActualizarFoto,
  eliminarFoto: mockEliminarFoto,
  subirFoto: vi.fn(),
}));

const mockFoto = {
  id: 1,
  entidad_tipo: 'accesion',
  entidad_id: 1,
  url: 'uploads/test.jpg',
  descripcion: 'Foto de prueba',
  es_principal: false,
  creado_en: '2025-01-01',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockListarFotos.mockResolvedValue([mockFoto]);
  mockListarAccesiones.mockResolvedValue([]);
  mockListarEnfermedadesResumen.mockResolvedValue([]);
  mockListarProductos.mockResolvedValue([]);
});

describe('AdminFotos', () => {
  it('renders section title', async () => {
    render(<AdminFotos />);

    await waitFor(() => {
      expect(mockListarAccesiones).toHaveBeenCalled();
    });

    expect(screen.getByText('Fotos')).toBeInTheDocument();
    expect(screen.getByText('Todas las Fotos')).toBeInTheDocument();
  });

  it('calls notificar with error when listarFotos fails', async () => {
    mockListarFotos.mockRejectedValue(
      new Error('Error al cargar fotos'),
    );

    render(<AdminFotos />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error al cargar fotos',
    );
  });

  it('calls notificar with success on delete', async () => {
    mockEliminarFoto.mockResolvedValue({ mensaje: 'Eliminada' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    render(<AdminFotos />);

    await waitFor(() => {
      expect(mockListarFotos).toHaveBeenCalled();
    });

    await user.click(screen.getByText('Eliminar'));

    await waitFor(() => {
      expect(mockEliminarFoto).toHaveBeenCalledWith(1);
    });
  });

  it('calls notificar with error on API reject', async () => {
    mockEliminarFoto.mockRejectedValue(new Error('Error de red'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    render(<AdminFotos />);

    await waitFor(() => {
      expect(mockListarFotos).toHaveBeenCalled();
    });

    await user.click(screen.getByText('Eliminar'));

    expect(await screen.findByText('Error de red')).toBeInTheDocument();
  });
});
