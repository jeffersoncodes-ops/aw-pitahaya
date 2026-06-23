import { describe, it, expect } from 'vitest';
import { render, screen } from './test/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import App from './App';

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('App — routing and layout', () => {
  it('renders Footer on home route', async () => {
    renderApp('/');

    expect(await screen.findByText(/Escuela Superior Politécnica/)).toBeInTheDocument();
  });

  it('shows NotFound page on unknown route', async () => {
    renderApp('/ruta-inexistente');

    expect(await screen.findByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
  });
});
