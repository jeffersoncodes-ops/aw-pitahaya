import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(
      <MemoryRouter>
        <EmptyState title="No hay datos" />
      </MemoryRouter>,
    );

    expect(screen.getByText('No hay datos')).toBeInTheDocument();
  });

  it('renders the message when provided', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Vacío" message="No se encontraron resultados." />
      </MemoryRouter>,
    );

    expect(screen.getByText('No se encontraron resultados.')).toBeInTheDocument();
  });

  it('does not render a message element when no message prop', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Solo título" />
      </MemoryRouter>,
    );

    const title = screen.getByText('Solo título');
    expect(title).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Test" icon={<span data-testid="custom-icon">🔍</span>} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders action button with correct label and link when action is provided', () => {
    render(
      <MemoryRouter>
        <EmptyState
          title="Vacío"
          action={{ label: 'Ir al inicio', to: '/' }}
        />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Ir al inicio' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('does not render action button when no action prop', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Solo título" />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
