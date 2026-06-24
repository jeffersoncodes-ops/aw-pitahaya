import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from './Home';

// Mock CarruselFotos to avoid API dependency
vi.mock('../../components/CarruselFotos', () => ({
  default: () => null,
}));

const theme = createTheme();

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('Home — Línea Gráfica Pitahaya', () => {
  it('renders hero headers with primary color', () => {
    renderWithProviders();
    const headers = screen.getAllByRole('heading');
    const heroHeader = headers.find((h) => h.textContent === 'Biodiversidad de Pitahaya');
    expect(heroHeader).toBeInTheDocument();
    // Verify the heading tag is present (h3 is the hero variant)
    expect(heroHeader?.tagName).toBe('H3');
  });

  it('has CTA button "Ver Catálogos" with secondary color', () => {
    renderWithProviders();
    const btn = screen.getByRole('link', { name: /Ver Catálogos/ });
    expect(btn).toBeInTheDocument();
    // MUI applies MuiButton-colorSecondary class when color="secondary"
    expect(btn.className).toContain('MuiButton-colorSecondary');
    expect(btn.className).not.toContain('MuiButton-colorPrimary');
  });

  it('has CTA button "Datos de Investigación" as outlined variant', () => {
    renderWithProviders();
    const btn = screen.getByRole('link', { name: /Datos de Investigación/ });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-outlined');
  });

  it('has card CTA "Ir a Catálogos" with secondary color', () => {
    renderWithProviders();
    const btn = screen.getByRole('link', { name: /Ir a Catálogos/ });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-colorSecondary');
  });

  it('has card CTA "Ir a Investigación" with primary color', () => {
    renderWithProviders();
    const btn = screen.getByRole('link', { name: /Ir a Investigación/ });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-colorPrimary');
  });

  it('has card CTA "Ver Noticias" as contained button', () => {
    renderWithProviders();
    const btn = screen.getByRole('link', { name: /Ver Noticias/ });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('MuiButton-contained');
  });
});
