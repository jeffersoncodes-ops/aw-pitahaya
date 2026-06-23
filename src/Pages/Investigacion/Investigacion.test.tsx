import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Investigacion from './Investigacion';

const mockListarAccesiones = vi.hoisted(() => vi.fn());
const mockListarDetecciones = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarAccesiones: mockListarAccesiones,
  listarDetecciones: mockListarDetecciones,
}));

const theme = createTheme();

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Investigacion />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

const mockDetecciones = [
  {
    id: 1,
    enfermedad: 'Antracnosis',
    codigo_accesion: 'EI-PIT-26-001',
    provincia: 'Orellana',
    variedad: 'roja',
    nivel_incidencia: 'alto',
    metodo_deteccion: 'PCR',
    fecha_deteccion: '2025-01-15',
  },
];

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
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Investigacion', () => {
  it('shows skeleton cards while loading', () => {
    mockListarAccesiones.mockReturnValue(new Promise<never>(() => {}));
    mockListarDetecciones.mockReturnValue(new Promise<never>(() => {}));

    renderWithProviders();

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('sets document title', () => {
    mockListarAccesiones.mockReturnValue(new Promise<never>(() => {}));
    mockListarDetecciones.mockReturnValue(new Promise<never>(() => {}));

    renderWithProviders();

    expect(document.title).toBe('Pitahaya — Investigación');
  });

  it('renders detecciones table after fetch', async () => {
    mockListarAccesiones.mockResolvedValue(mockAccesiones);
    mockListarDetecciones.mockResolvedValue(mockDetecciones);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Antracnosis')).toBeInTheDocument();
    });

    expect(screen.getByText('EI-PIT-26-001')).toBeInTheDocument();
    expect(screen.getByText('Orellana')).toBeInTheDocument();
  });

  it('shows EmptyState when no detecciones', async () => {
    mockListarAccesiones.mockResolvedValue([]);
    mockListarDetecciones.mockResolvedValue([]);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Sin detecciones')).toBeInTheDocument();
    });

    expect(
      screen.getByText('No hay detecciones registradas aún.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Sin detecciones registradas'),
    ).not.toBeInTheDocument();
  });

  it('has fade-in-page class on root container', () => {
    mockListarAccesiones.mockReturnValue(new Promise<never>(() => {}));
    mockListarDetecciones.mockReturnValue(new Promise<never>(() => {}));

    const { container } = renderWithProviders();

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('fade-in-page');
  });
});
