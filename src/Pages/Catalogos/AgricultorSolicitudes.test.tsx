import { render, screen, waitFor } from '@testing-library/react';
import AgricultorSolicitudes from './AgricultorSolicitudes';

const mockMisSolicitudes = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  misSolicitudes: mockMisSolicitudes,
}));

const mockSolicitudes = [
  {
    id: 1,
    numero_seguimiento: 'SOL-001',
    fecha: '2025-01-15',
    estado: 'aprobada',
    observaciones: 'Listo para entrega',
    items: [{ cropname: 'Pitahaya roja', codigo: 'EI-PIT-26-001', cantidad: 5, unidad: 'kg' }],
  },
  {
    id: 2,
    numero_seguimiento: 'SOL-002',
    fecha: '2025-02-01',
    estado: 'pendiente',
    observaciones: null,
    items: [{ cropname: 'Pitahaya amarilla', codigo: 'EI-PIT-26-002', cantidad: 3, unidad: 'kg' }],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AgricultorSolicitudes', () => {
  it('shows skeleton rows while loading', () => {
    mockMisSolicitudes.mockReturnValue(new Promise<never>(() => {}));

    render(<AgricultorSolicitudes />);

    expect(screen.getAllByTestId('skeleton-cell')).toHaveLength(5 * 5);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders solicitudes rows after fetch', async () => {
    mockMisSolicitudes.mockResolvedValue(mockSolicitudes);

    render(<AgricultorSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText('SOL-001')).toBeInTheDocument();
    });

    expect(screen.getByText('SOL-002')).toBeInTheDocument();
    expect(screen.getByText('Aprobada')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('shows error alert on fetch failure', async () => {
    mockMisSolicitudes.mockRejectedValue(new Error('Error de conexión'));

    render(<AgricultorSolicitudes />);

    await waitFor(() => {
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });
  });

  it('shows EmptyState when no solicitudes', async () => {
    mockMisSolicitudes.mockResolvedValue([]);

    render(<AgricultorSolicitudes />);

    await waitFor(() => {
      expect(
        screen.getByText('Sin solicitudes'),
      ).toBeInTheDocument();
    });
  });
});
