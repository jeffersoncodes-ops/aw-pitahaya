import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });

  it('renders the subtitle message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(
      screen.getByText('La página que buscas no existe o fue movida.'),
    ).toBeInTheDocument();
  });

  it('renders "Volver al inicio" button linking to /', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Volver al inicio' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the sad face icon', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('SentimentDissatisfiedIcon')).toBeInTheDocument();
  });

  it('sets document title', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Pitahaya — Página no encontrada');
  });
});
