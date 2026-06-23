import { render, screen, waitFor } from '@testing-library/react';
import ProductosGrid from './ProductosGrid';

const mockListarProductos = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarProductos: mockListarProductos,
}));

const mockProductos = [
  {
    id: 1,
    nombre: 'Pulpa de pitahaya',
    descripcion: 'Pulpa natural congelada',
    tipo: 'alimento',
    fotografia_url: null,
  },
  {
    id: 2,
    nombre: 'Mermelada artesanal',
    descripcion: 'Mermelada sin conservantes',
    tipo: 'alimento',
    fotografia_url: '/uploads/mermelada.jpg',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProductosGrid', () => {
  it('shows skeleton cards while loading', () => {
    mockListarProductos.mockReturnValue(new Promise<never>(() => {}));

    render(<ProductosGrid />);

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders product cards after fetch', async () => {
    mockListarProductos.mockResolvedValue(mockProductos);

    render(<ProductosGrid />);

    await waitFor(() => {
      expect(screen.getByText('Pulpa de pitahaya')).toBeInTheDocument();
    });

    expect(screen.getByText('Mermelada artesanal')).toBeInTheDocument();
    expect(
      screen.getByText('Pulpa natural congelada'),
    ).toBeInTheDocument();
  });

  it('shows EmptyState when no products', async () => {
    mockListarProductos.mockResolvedValue([]);

    render(<ProductosGrid />);

    await waitFor(() => {
      expect(screen.getByText('Sin productos')).toBeInTheDocument();
    });

    expect(
      screen.getByText('No hay productos registrados aún.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No hay productos registrados aún.'),
    ).toBeInTheDocument();
  });
});
