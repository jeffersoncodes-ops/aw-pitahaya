import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen } from '../../test/test-utils';
import ErrorBoundary from './ErrorBoundary';

const originalLocation = window.location;

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(window, 'location', {
    value: originalLocation,
    writable: true,
  });
});

function ThrowComponent({ message }: { message: string }) {
  throw new Error(message);
  return null;
}

function HealthyComponent() {
  return <div>Healthy content</div>;
}

describe('ErrorBoundary', () => {
  it('renders children normally when no error', () => {
    render(
      <ErrorBoundary>
        <HealthyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Healthy content')).toBeInTheDocument();
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
  });

  it('shows fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowComponent message="Something broke" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Something broke')).toBeInTheDocument();
    expect(screen.getByText('Recargar página')).toBeInTheDocument();
  });

  it('reload button calls window.location.reload', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    });

    render(
      <ErrorBoundary>
        <ThrowComponent message="Error" />
      </ErrorBoundary>,
    );

    screen.getByText('Recargar página').click();
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
