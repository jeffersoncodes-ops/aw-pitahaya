import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '../../test/test-utils';
import { render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import SolicitudesTable from './SolicitudesTable';

const mockActualizarSolicitud = vi.hoisted(() => vi.fn());
const mockEliminarSolicitud = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  actualizarSolicitud: mockActualizarSolicitud,
  eliminarSolicitud: mockEliminarSolicitud,
}));

const mockSolicitudes = [
  {
    id: 1,
    numero_seguimiento: 'SOL-001',
    solicitante_nombre: 'Juan Perez',
    solicitante_email: 'juan@test.com',
    solicitante_telefono: '0999999999',
    solicitante_cedula: '1101',
    solicitante_finca: 'Finca Test',
    estado: 'pendiente',
    fecha: '2025-01-01',
    atendido_por: null,
    observaciones: '',
    items: [{ codigo: 'ACC-001', cropname: 'Pitahaya', cantidad: 10 }],
  },
  {
    id: 2,
    numero_seguimiento: 'SOL-002',
    solicitante_nombre: 'Maria Gomez',
    solicitante_email: 'maria@test.com',
    solicitante_telefono: '0988888888',
    solicitante_cedula: '1102',
    solicitante_finca: 'Finca Maria',
    estado: 'aprobada',
    fecha: '2025-02-01',
    atendido_por: 'Admin',
    observaciones: 'Todo ok',
    items: [{ codigo: 'ACC-002', cropname: 'Pitahaya', cantidad: 5 }],
  },
];

const onRefreshMock = vi.fn();

describe('SolicitudesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders solicitudes rows with tracking numbers and status chips', () => {
    render(
      <SolicitudesTable solicitudes={mockSolicitudes} onRefresh={onRefreshMock} />,
    );

    expect(screen.getByText('SOL-001')).toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('SOL-002')).toBeInTheDocument();
    expect(screen.getByText('Maria Gomez')).toBeInTheDocument();
    expect(screen.getByText('pendiente')).toBeInTheDocument();
    expect(screen.getByText('aprobada')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('opens Gestionar dialog with tracking number in title', async () => {
    const user = userEvent.setup();
    render(
      <SolicitudesTable solicitudes={mockSolicitudes} onRefresh={onRefreshMock} />,
    );

    await user.click(screen.getAllByText('Gestionar')[0]);

    expect(screen.getByText('Solicitud SOL-001')).toBeInTheDocument();
  });

  it('shows EmptyState when no solicitudes', () => {
    render(<SolicitudesTable solicitudes={[]} onRefresh={onRefreshMock} />);

    expect(screen.getByText('Sin solicitudes')).toBeInTheDocument();
    expect(
      screen.getByText('No hay solicitudes pendientes.'),
    ).toBeInTheDocument();
  });

  it('update solicitud calls API and notifies success', async () => {
    mockActualizarSolicitud.mockResolvedValue({ mensaje: 'ok' });
    const user = userEvent.setup();
    render(
      <SolicitudesTable solicitudes={mockSolicitudes} onRefresh={onRefreshMock} />,
    );

    await user.click(screen.getAllByText('Gestionar')[0]);
    await user.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(mockActualizarSolicitud).toHaveBeenCalledWith({
        id: 1,
        estado: 'pendiente',
        observaciones: '',
      });
    });

    // Dialog closes on success, alert is accessible
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Solicitud actualizada correctamente',
    );
  });

  it('delete solicitud calls API and notifies success', async () => {
    mockEliminarSolicitud.mockResolvedValue({ mensaje: 'eliminado' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    render(
      <SolicitudesTable solicitudes={mockSolicitudes} onRefresh={onRefreshMock} />,
    );

    await user.click(screen.getAllByText('Eliminar')[0]);

    await waitFor(() => {
      expect(mockEliminarSolicitud).toHaveBeenCalledWith(1);
    });

    // No dialog involved in delete (uses confirm, then calls API directly)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Solicitud eliminada',
    );
  });

  it('API error on update shows error notification', async () => {
    mockActualizarSolicitud.mockRejectedValue(new Error('Error de conexión'));
    const user = userEvent.setup();
    render(
      <SolicitudesTable solicitudes={mockSolicitudes} onRefresh={onRefreshMock} />,
    );

    await user.click(screen.getAllByText('Gestionar')[0]);
    await user.click(screen.getByText('Guardar'));

    // Dialog stays open on error; use findByText (ignores aria-hidden)
    expect(await screen.findByText('Error de conexión')).toBeInTheDocument();
  });
});
