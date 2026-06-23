import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  login as apiLogin,
  registro as apiRegistro,
  logout as apiLogout,
  getUsuario,
  estaAutenticado,
  type UsuarioInfo,
} from '../services/api';
import { STORAGE_KEYS } from '../config/constants';

interface AuthContextType {
  user: UsuarioInfo | null;
  isAuth: boolean;
  esAdmin: boolean;
  esAgricultor: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (data: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    cedula?: string;
    finca?: string;
    direccion?: string;
  }) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  esAdmin: false,
  esAgricultor: false,
  loginUser: async () => {},
  registerUser: async () => {},
  logoutUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioInfo | null>(() =>
    estaAutenticado() ? getUsuario() : null,
  );

  const loginUser = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.usuario));
    setUser(res.usuario);
  };

  const registerUser = async (data: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    cedula?: string;
    finca?: string;
    direccion?: string;
  }) => {
    const res = await apiRegistro(data);
    localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.usuario));
    setUser(res.usuario);
  };

  const logoutUser = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        esAdmin: user?.rol === 'admin',
        esAgricultor: user?.rol === 'agricultor',
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
