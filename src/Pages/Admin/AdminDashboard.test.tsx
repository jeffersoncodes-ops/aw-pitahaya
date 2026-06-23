import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminDashboard from './AdminDashboard';

const mockAdminResumen = vi.hoisted(() => vi.fn());
const mockListarSolicitudesAdmin = vi.hoisted(() => vi.fn());
const mockListarAccesiones = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  adminResumen: mockAdminResumen,
  listarSolicitudesAdmin: mockListarSolicitudesAdmin,
  listarAccesiones: mockListarAccesiones,
}));

const theme = createTheme();

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AdminDashboard />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AdminDashboard', () => {
  it('shows skeleton cards while loading', () => {
    mockAdminResumen.mockReturnValue(new Promise<never>(() => {}));
    mockListarSolicitudesAdmin.mockReturnValue(new Promise<never>(() => {}));
    mockListarAccesiones.mockReturnValue(new Promise<never>(() => {}));

    renderWithProviders();

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders dashboard cards after fetch', async () => {
    mockAdminResumen.mockResolvedValue({
      totals: {
        total_accesiones: 10,
        total_solicitudes: 5,
        pendientes: 2,
        total_enfermedades: 3,
      },
      inventario: [],
    });
    mockListarSolicitudesAdmin.mockResolvedValue([]);
    mockListarAccesiones.mockResolvedValue([]);

    renderWithProviders();

    // Wait for dashboard cards to render
    const accesionesLabel = await screen.findAllByText('Accesiones');
    expect(accesionesLabel.length).toBeGreaterThanOrEqual(1);
  });
});
