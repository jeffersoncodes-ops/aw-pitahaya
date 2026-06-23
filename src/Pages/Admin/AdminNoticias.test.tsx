import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '../../test/test-utils';
import { render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import AdminNoticias from './AdminNoticias';

const mockListarNoticiasAdmin = vi.hoisted(() => vi.fn());
const mockCrearNoticia = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  listarNoticiasAdmin: mockListarNoticiasAdmin,
  crearNoticia: mockCrearNoticia,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockListarNoticiasAdmin.mockResolvedValue([]);
});

describe('AdminNoticias', () => {
  it('renders section title and create button', async () => {
    render(<AdminNoticias />);
    await waitFor(() => expect(mockListarNoticiasAdmin).toHaveBeenCalled());
    expect(screen.getByText('Noticias')).toBeInTheDocument();
    expect(screen.getByText('+ Nueva Noticia')).toBeInTheDocument();
  });

  it('calls notificar with error on mount failure', async () => {
    mockListarNoticiasAdmin.mockRejectedValue(new Error('Error al cargar noticias'));
    render(<AdminNoticias />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Error al cargar noticias');
  });

  it('calls notificar with success on create', async () => {
    mockCrearNoticia.mockResolvedValue({ success: true, id: 1 });
    const user = userEvent.setup();
    render(<AdminNoticias />);
    await waitFor(() => expect(mockListarNoticiasAdmin).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nueva Noticia'));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Título *'), 'Nueva noticia');
    await user.type(screen.getByLabelText('Contenido *'), 'Contenido');
    await user.click(screen.getByText('Crear'));

    await waitFor(() => expect(mockCrearNoticia).toHaveBeenCalled());
    expect(await screen.findByRole('alert')).toHaveTextContent('Noticia creada correctamente');
  });

  it('calls notificar with error on create API failure', async () => {
    mockCrearNoticia.mockRejectedValue(new Error('Error al guardar la noticia'));
    const user = userEvent.setup();
    render(<AdminNoticias />);
    await waitFor(() => expect(mockListarNoticiasAdmin).toHaveBeenCalled());

    await user.click(screen.getByText('+ Nueva Noticia'));
    await screen.findByRole('dialog');
    await user.type(screen.getByLabelText('Título *'), 'Nueva noticia');
    await user.type(screen.getByLabelText('Contenido *'), 'Contenido');
    await user.click(screen.getByText('Crear'));

    expect(await screen.findByText('Error al guardar la noticia')).toBeInTheDocument();
  });
}, 15000);
