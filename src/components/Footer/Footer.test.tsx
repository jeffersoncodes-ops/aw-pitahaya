import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Footer from './Footer';

describe('Footer', () => {
  it('renders university name', () => {
    render(<Footer />);

    expect(
      screen.getByText(/Escuela Superior Politécnica de Chimborazo/),
    ).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });
});
