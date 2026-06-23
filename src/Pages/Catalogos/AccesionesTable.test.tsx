import { render, screen, waitFor } from '@testing-library/react';
import AccesionesTable from './AccesionesTable';

const mockListarAccesiones = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarAccesiones: mockListarAccesiones,
}));

const mockAccesiones = [
  {
    id: 1,
    codigo_accesion: 'EI-PIT-26-001',
    cropname: 'Pitahaya roja',
    accename: 'Roja Orellana',
    variedad: 'roja',
    provincia: 'Orellana',
    genus: 'Hylocereus',
    species: 'undatus',
    latitude: '-0.847',
    longitude: '-76.501',
    elevation: 250,
    tecnico: 'Carlos Mendoza',
    propietario: 'Juan Pacay',
  },
  {
    id: 2,
    codigo_accesion: 'EI-PIT-26-002',
    cropname: 'Pitahaya amarilla',
    accename: 'Amarilla Palora',
    variedad: 'amarilla',
    provincia: 'Palora',
    genus: 'Selenicereus',
    species: 'megalanthus',
    latitude: '-1.695',
    longitude: '-77.935',
    elevation: 380,
    tecnico: 'Carlos Mendoza',
    propietario: 'Juan Pacay',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AccesionesTable', () => {
  it('shows skeleton rows while loading', () => {
    mockListarAccesiones.mockReturnValue(new Promise<never>(() => {}));

    render(<AccesionesTable />);

    expect(screen.getAllByTestId('skeleton-cell')).toHaveLength(5 * 6);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders table rows with accesion data', async () => {
    mockListarAccesiones.mockResolvedValue(mockAccesiones);

    render(<AccesionesTable />);

    await waitFor(() => {
      expect(screen.getByText('EI-PIT-26-001')).toBeInTheDocument();
    });

    // Data cells
    expect(screen.getByText('Pitahaya roja')).toBeInTheDocument();
    expect(screen.getByText('EI-PIT-26-002')).toBeInTheDocument();
    expect(screen.getByText('Pitahaya amarilla')).toBeInTheDocument();
    expect(screen.getAllByText('Carlos Mendoza')).toHaveLength(2);

    // Table headers
    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Variedad')).toBeInTheDocument();
    expect(screen.getByText('Provincia')).toBeInTheDocument();
    expect(screen.getByText('Especie')).toBeInTheDocument();
    expect(screen.getByText('Técnico')).toBeInTheDocument();
  });

  it('shows variety chips with correct labels (roja and amarilla)', async () => {
    mockListarAccesiones.mockResolvedValue(mockAccesiones);

    render(<AccesionesTable />);

    await waitFor(() => {
      expect(screen.getByText('roja')).toBeInTheDocument();
    });

    expect(screen.getByText('amarilla')).toBeInTheDocument();
  });

  it('handles empty data gracefully', async () => {
    mockListarAccesiones.mockResolvedValue([]);

    render(<AccesionesTable />);

    await waitFor(() => {
      // Table headers should still render
      expect(screen.getByText('Código')).toBeInTheDocument();
    });

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Variedad')).toBeInTheDocument();

    // No data rows should be present
    expect(screen.queryByText('EI-PIT-26-001')).not.toBeInTheDocument();
  });
});
