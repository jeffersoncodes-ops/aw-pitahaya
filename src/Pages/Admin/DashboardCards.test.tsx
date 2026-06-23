import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import DashboardCards from './DashboardCards';

describe('DashboardCards', () => {
  const totals = {
    total_accesiones: 10,
    total_solicitudes: 5,
    pendientes: 2,
    total_enfermedades: 3,
  };

  it('renders 4 summary cards with totals', () => {
    render(<DashboardCards totals={totals} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Accesiones')).toBeInTheDocument();
    expect(screen.getByText('Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Enfermedades')).toBeInTheDocument();
  });

  it('handles undefined totals gracefully', () => {
    render(<DashboardCards totals={undefined} />);

    // Cards render without crashing
    expect(screen.getByText('Accesiones')).toBeInTheDocument();
    expect(screen.getByText('Solicitudes')).toBeInTheDocument();
    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Enfermedades')).toBeInTheDocument();
  });
});
