import { render, screen, waitFor } from '@testing-library/react';
import EnfermedadesList from './EnfermedadesList';

const mockListarEnfermedades = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarEnfermedades: mockListarEnfermedades,
}));

const mockEnfermedades = [
  {
    id: 1,
    nombre_comun: 'Antracnosis',
    nombre_cientifico: 'Colletotrichum gloeosporioides',
    tipo: 'hongo',
    sintomas: 'Manchas oscuras en frutos',
    tratamientos: [
      { nombre: 'Fungicida cúprico', tipo: 'químico', dosis: '2g/L', frecuencia: 'cada 15 días' },
    ],
  },
  {
    id: 2,
    nombre_comun: 'Bacteriosis',
    nombre_cientifico: 'Xanthomonas campestris',
    tipo: 'bacteria',
    sintomas: 'Pudrición blanda',
    tratamientos: [],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('EnfermedadesList', () => {
  it('shows skeleton cards while loading', () => {
    mockListarEnfermedades.mockReturnValue(new Promise<never>(() => {}));

    render(<EnfermedadesList />);

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders disease cards after fetch', async () => {
    mockListarEnfermedades.mockResolvedValue(mockEnfermedades);

    render(<EnfermedadesList />);

    await waitFor(() => {
      expect(screen.getByText('Antracnosis')).toBeInTheDocument();
    });

    expect(screen.getByText('Bacteriosis')).toBeInTheDocument();
    expect(
      screen.getByText('Colletotrichum gloeosporioides'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Xanthomonas campestris'),
    ).toBeInTheDocument();
  });

  it('shows treatment table when treatments exist', async () => {
    mockListarEnfermedades.mockResolvedValue(mockEnfermedades);

    render(<EnfermedadesList />);

    await waitFor(() => {
      expect(screen.getByText('Antracnosis')).toBeInTheDocument();
    });

    expect(screen.getByText('Fungicida cúprico')).toBeInTheDocument();
  });
});
