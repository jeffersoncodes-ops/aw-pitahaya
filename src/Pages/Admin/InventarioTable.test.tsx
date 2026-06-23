import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import InventarioTable from './InventarioTable';

const mockCrearInventario = vi.hoisted(() => vi.fn());
const mockActualizarInventario = vi.hoisted(() => vi.fn());
const mockEliminarInventario = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  crearInventario: mockCrearInventario,
  actualizarInventario: mockActualizarInventario,
  eliminarInventario: mockEliminarInventario,
}));

const mockAccesiones = [
  {
    id: 1,
    codigo_accesion: 'ACC-001',
    accename: 'ACC-001',
    cropname: 'Pitahaya',
    variedad: 'roja',
    provincia: 'Loja',
    genus: 'Hylocereus',
    species: 'undatus',
    latitude: '-4.0',
    longitude: '-79.2',
    elevation: 1500,
    tecnico: 'Juan',
    propietario: 'Maria',
  },
];

const mockInventario = [
  {
    id: 1,
    accesion_id: 1,
    codigo_ubicacion: 'A-01',
    cantidad_disponible: 100,
    unidad: 'libras',
    codigo_accesion: 'ACC-001',
    cropname: 'Pitahaya',
    variedad: 'roja',
  },
];

const onRefreshMock = vi.fn();

describe('InventarioTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inventory items with codigo_ubicacion and cantidad_disponible', () => {
    render(
      <InventarioTable
        inventario={mockInventario}
        accesiones={mockAccesiones}
        onRefresh={onRefreshMock}
      />,
    );

    expect(screen.getByText('A-01')).toBeInTheDocument();
    expect(screen.getByText('ACC-001')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('shows empty state when no inventory', () => {
    render(
      <InventarioTable
        inventario={[]}
        accesiones={mockAccesiones}
        onRefresh={onRefreshMock}
      />,
    );

    expect(screen.getByText('Sin inventario')).toBeInTheDocument();
  });

  it('opens create dialog with "Nuevo Item de Inventario" title', async () => {
    const user = userEvent.setup();
    render(
      <InventarioTable
        inventario={mockInventario}
        accesiones={mockAccesiones}
        onRefresh={onRefreshMock}
      />,
    );

    await user.click(screen.getByText('+ Nuevo Item'));

    expect(
      screen.getByText('Nuevo Item de Inventario'),
    ).toBeInTheDocument();
  });

  it('validation prevents save without codigo_ubicacion and shows warning', async () => {
    const user = userEvent.setup();
    render(
      <InventarioTable
        inventario={[]}
        accesiones={mockAccesiones}
        onRefresh={onRefreshMock}
      />,
    );

    await user.click(screen.getByText('+ Nuevo Item'));
    // codigo_ubicacion is empty by default; click Crear
    await user.click(screen.getByText('Crear'));

    expect(mockCrearInventario).not.toHaveBeenCalled();

    // Dialog stays open on validation warning; use findByText (ignores aria-hidden)
    expect(await screen.findByText('Completa el código de ubicación')).toBeInTheDocument();
  });
});
