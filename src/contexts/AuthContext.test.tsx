import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const mockApiLogin = vi.hoisted(() => vi.fn());
const mockApiRegistro = vi.hoisted(() => vi.fn());
const mockApiLogout = vi.hoisted(() => vi.fn());
const mockGetUsuario = vi.hoisted(() => vi.fn());
const mockEstaAutenticado = vi.hoisted(() => vi.fn());

vi.mock('../services/api', () => ({
  login: mockApiLogin,
  registro: mockApiRegistro,
  logout: mockApiLogout,
  getUsuario: mockGetUsuario,
  estaAutenticado: mockEstaAutenticado,
}));

function TestComponent() {
  const { user, isAuth, esAdmin, esAgricultor, loginUser, logoutUser, registerUser } =
    useAuth();
  const [errMsg, setErrMsg] = useState('');

  return (
    <div>
      <span data-testid="isAuth">{String(isAuth)}</span>
      <span data-testid="userName">{user?.nombre || 'no-user'}</span>
      <span data-testid="esAdmin">{String(esAdmin)}</span>
      <span data-testid="esAgricultor">{String(esAgricultor)}</span>
      <span data-testid="errorMsg">{errMsg}</span>
      <button
        data-testid="loginBtn"
        onClick={() =>
          loginUser('test@test.com', 'pass').catch((e: Error) =>
            setErrMsg(e.message),
          )
        }
      >
        Login
      </button>
      <button
        data-testid="registerBtn"
        onClick={() =>
          registerUser({
            nombre: 'Test',
            email: 'test@test.com',
            password: 'pass',
          }).catch((e: Error) => setErrMsg(e.message))
        }
      >
        Register
      </button>
      <button data-testid="logoutBtn" onClick={logoutUser}>
        Logout
      </button>
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('AuthContext', () => {
  it('initial state: user is null, isAuth is false when no token', () => {
    mockEstaAutenticado.mockReturnValue(false);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('isAuth')).toHaveTextContent('false');
    expect(screen.getByTestId('userName')).toHaveTextContent('no-user');
    expect(screen.getByTestId('esAdmin')).toHaveTextContent('false');
    expect(screen.getByTestId('esAgricultor')).toHaveTextContent('false');
  });

  it('auto-login from localStorage when auth_token and auth_user exist', () => {
    mockEstaAutenticado.mockReturnValue(true);
    mockGetUsuario.mockReturnValue({
      id: 1,
      nombre: 'Admin User',
      email: 'admin@test.com',
      rol: 'admin',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('isAuth')).toHaveTextContent('true');
    expect(screen.getByTestId('userName')).toHaveTextContent('Admin User');
    expect(screen.getByTestId('esAdmin')).toHaveTextContent('true');
    expect(screen.getByTestId('esAgricultor')).toHaveTextContent('false');
  });

  it('loginUser calls apiLogin, stores token and user, updates state', async () => {
    mockEstaAutenticado.mockReturnValue(false);
    const usuario = {
      id: 2,
      nombre: 'Agricultor User',
      email: 'agri@test.com',
      rol: 'agricultor',
    };
    mockApiLogin.mockResolvedValue({ token: 'jwt-token', usuario });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('loginBtn'));

    await waitFor(() => {
      expect(mockApiLogin).toHaveBeenCalledWith('test@test.com', 'pass');
    });

    expect(screen.getByTestId('userName')).toHaveTextContent('Agricultor User');
    expect(screen.getByTestId('isAuth')).toHaveTextContent('true');
    expect(screen.getByTestId('esAgricultor')).toHaveTextContent('true');
    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(usuario));
  });

  it('loginUser error propagates and state remains unchanged', async () => {
    mockEstaAutenticado.mockReturnValue(false);
    mockApiLogin.mockRejectedValue(new Error('Credenciales inválidas'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('loginBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toHaveTextContent(
        'Credenciales inválidas',
      );
    });

    expect(screen.getByTestId('isAuth')).toHaveTextContent('false');
    expect(screen.getByTestId('userName')).toHaveTextContent('no-user');
  });

  it('registerUser calls apiRegistro, stores token and user, updates state', async () => {
    mockEstaAutenticado.mockReturnValue(false);
    const usuario = {
      id: 3,
      nombre: 'New User',
      email: 'new@test.com',
      rol: 'agricultor',
    };
    mockApiRegistro.mockResolvedValue({ token: 'reg-token', usuario });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('registerBtn'));

    await waitFor(() => {
      expect(mockApiRegistro).toHaveBeenCalled();
    });

    expect(screen.getByTestId('userName')).toHaveTextContent('New User');
    expect(screen.getByTestId('isAuth')).toHaveTextContent('true');
    expect(localStorage.getItem('auth_token')).toBe('reg-token');
    expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(usuario));
  });

  it('logoutUser calls apiLogout, clears user, sets isAuth false', async () => {
    mockEstaAutenticado.mockReturnValue(false);
    mockApiLogin.mockResolvedValue({
      token: 't',
      usuario: { id: 4, nombre: 'Temp', email: 't@t.com', rol: 'agricultor' },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Login first so we have a user to logout
    await userEvent.click(screen.getByTestId('loginBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('isAuth')).toHaveTextContent('true');
    });

    // Now logout
    await userEvent.click(screen.getByTestId('logoutBtn'));

    expect(mockApiLogout).toHaveBeenCalled();
    expect(screen.getByTestId('isAuth')).toHaveTextContent('false');
    expect(screen.getByTestId('userName')).toHaveTextContent('no-user');
  });

  it('esAdmin is true when user has rol admin', () => {
    mockEstaAutenticado.mockReturnValue(true);
    mockGetUsuario.mockReturnValue({
      id: 1,
      nombre: 'Admin',
      email: 'a@a.com',
      rol: 'admin',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('esAdmin')).toHaveTextContent('true');
    expect(screen.getByTestId('esAgricultor')).toHaveTextContent('false');
  });

  it('esAgricultor is true when user has rol agricultor', () => {
    mockEstaAutenticado.mockReturnValue(true);
    mockGetUsuario.mockReturnValue({
      id: 2,
      nombre: 'Agri',
      email: 'agri@test.com',
      rol: 'agricultor',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('esAgricultor')).toHaveTextContent('true');
    expect(screen.getByTestId('esAdmin')).toHaveTextContent('false');
  });
});
