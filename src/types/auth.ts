export interface UsuarioInfo {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  cedula?: string;
  finca?: string;
  direccion?: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioInfo;
}

export interface Tecnico {
  id: number;
  nombre: string;
  correo: string | null;
  cargo: string | null;
}

export interface Propietario {
  id: number;
  nombre_productor: string;
  cedula: string | null;
  celular: string | null;
  nombre_finca: string | null;
}

export interface Donante {
  id: number;
  institucion: string | null;
  nombre: string | null;
  numero_accesion: string | null;
}
