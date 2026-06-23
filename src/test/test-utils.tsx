import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { NotificacionProvider } from '../components/Notificacion';

function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: NotificacionProvider, ...options });
}

export function createMockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response;
}

export function mockFetchSuccess(data: unknown) {
  return vi.mocked(fetch).mockResolvedValue(createMockResponse(data));
}

export function mockFetchError(status = 500, message = 'Error') {
  return vi.mocked(fetch).mockResolvedValue(
    createMockResponse({ error: message }, status),
  );
}

export * from '@testing-library/react';
export { renderWithProviders as render };
