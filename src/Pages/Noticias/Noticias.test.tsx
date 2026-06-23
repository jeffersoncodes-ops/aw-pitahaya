import { render, screen, waitFor } from '@testing-library/react';
import Noticias from './Noticias';

const mockListarNoticias = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarNoticias: mockListarNoticias,
}));

const mockNoticias = [
  {
    id: 1,
    titulo: 'Nueva variedad de pitahaya',
    contenido: 'Se ha descubierto una nueva variedad en la región amazónica.',
    foto_url: null,
    fecha: '2025-01-15',
    autor: 'Admin',
  },
  {
    id: 2,
    titulo: 'Taller de capacitación',
    contenido: 'Invitamos a todos los agricultores al taller mensual.',
    foto_url: null,
    fecha: '2025-02-01',
    autor: 'Técnico',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Noticias', () => {
  it('shows skeleton cards while loading', () => {
    mockListarNoticias.mockReturnValue(new Promise<never>(() => {}));

    render(<Noticias />);

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('sets document title', () => {
    mockListarNoticias.mockReturnValue(new Promise<never>(() => {}));

    render(<Noticias />);

    expect(document.title).toBe('Pitahaya — Noticias');
  });

  it('renders news cards after fetch', async () => {
    mockListarNoticias.mockResolvedValue(mockNoticias);

    render(<Noticias />);

    await waitFor(() => {
      expect(screen.getByText('Nueva variedad de pitahaya')).toBeInTheDocument();
    });

    expect(screen.getByText('Taller de capacitación')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Se ha descubierto una nueva variedad en la región amazónica.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Por: Admin')).toBeInTheDocument();
    expect(screen.getByText('Por: Técnico')).toBeInTheDocument();
    expect(screen.getByText('2025-01-15')).toBeInTheDocument();
    expect(screen.getByText('2025-02-01')).toBeInTheDocument();
  });

  it('shows EmptyState when no news', async () => {
    mockListarNoticias.mockResolvedValue([]);

    render(<Noticias />);

    await waitFor(() => {
      expect(screen.getByText('Sin noticias')).toBeInTheDocument();
    });

    expect(
      screen.getByText('No hay noticias publicadas aún.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('No hay noticias aún.')).not.toBeInTheDocument();
  });

  it('handles fetch error gracefully with EmptyState', async () => {
    mockListarNoticias.mockRejectedValue(new Error('Network error'));

    render(<Noticias />);

    await waitFor(() => {
      expect(screen.getByText('Sin noticias')).toBeInTheDocument();
    });

    expect(
      screen.getByText('No hay noticias publicadas aún.'),
    ).toBeInTheDocument();
  });

  it('has fade-in-page class on root container', () => {
    mockListarNoticias.mockReturnValue(new Promise<never>(() => {}));

    const { container } = render(<Noticias />);

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('fade-in-page');
  });
});
