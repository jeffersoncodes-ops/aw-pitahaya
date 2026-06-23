import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import Admin from './Admin';

// Mock all child components to avoid API calls and complex rendering
vi.mock('./AdminDashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));
vi.mock('./AdminAccesiones', () => ({
  default: () => <div data-testid="accesiones">Accesiones</div>,
}));
vi.mock('./AdminEnfermedades', () => ({
  default: () => <div data-testid="enfermedades">Enfermedades</div>,
}));
vi.mock('./AdminProductos', () => ({
  default: () => <div data-testid="productos">Productos</div>,
}));
vi.mock('./AdminNoticias', () => ({
  default: () => <div data-testid="noticias">Noticias</div>,
}));
vi.mock('./AdminFotos', () => ({
  default: () => <div data-testid="fotos">Fotos</div>,
}));

describe('Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and all tabs', () => {
    render(<Admin />);

    expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
    // Tabs exist (they appear both in the tablist and in the mocked children)
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.getAllByText('Accesiones')).toHaveLength(1);
    expect(screen.getAllByText('Enfermedades')).toHaveLength(1);
    expect(screen.getAllByText('Productos')).toHaveLength(1);
    expect(screen.getAllByText('Noticias')).toHaveLength(1);
    expect(screen.getAllByText('Fotos')).toHaveLength(1);
  });

  it('shows Dashboard by default (tab 0)', () => {
    render(<Admin />);

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('accesiones')).not.toBeInTheDocument();
  });

  it('switches content when tabs are clicked', async () => {
    const user = userEvent.setup();
    render(<Admin />);

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Accesiones' }));
    expect(await screen.findByTestId('accesiones')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Enfermedades' }));
    expect(await screen.findByTestId('enfermedades')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Productos' }));
    expect(await screen.findByTestId('productos')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Noticias' }));
    expect(await screen.findByTestId('noticias')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Fotos' }));
    expect(await screen.findByTestId('fotos')).toBeInTheDocument();

    // Back to Dashboard
    await user.click(screen.getByRole('tab', { name: 'Dashboard' }));
    expect(await screen.findByTestId('dashboard')).toBeInTheDocument();
  }, 15000);

  it('has no Alert element (no mensaje state)', () => {
    render(<Admin />);

    // Admin component itself should not render any Alert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
