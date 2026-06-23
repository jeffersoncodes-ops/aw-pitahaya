import { API_BASE, STORAGE_KEYS } from '../config/constants';
import { extractResponseError } from './errors';

function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(await extractResponseError(res));
  }

  return res.json();
}

async function fetchAuthJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('No autenticado');

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = '/admin';
    throw new Error('Sesion expirada');
  }

  if (!res.ok) {
    throw new Error(await extractResponseError(res));
  }

  return res.json();
}

// -- Tipos importados desde src/types/ --

import type {
  AccesionResumen, DetalleAccesion, PlantaConEvaluaciones, CrearAccesionData, BusquedaResultado,
} from '../types/accesion';
import type {
  Enfermedad, Tratamiento, Deteccion, DeteccionInvestigacion, EnfermedadAdmin, TratamientoAdmin, EnfermedadResumen,
} from '../types/enfermedad';
import type { Noticia, NoticiaAdmin } from '../types/noticia';
import type { ProductoAdmin, ProductoResumen } from '../types/producto';
import type { SolicitudAdmin, SolicitudItem } from '../types/solicitud';
import type { InventarioItem } from '../types/inventario';

export interface InventarioDisponible {
  id: number;
  codigo_ubicacion: string;
  cantidad_disponible: number;
  unidad: string;
  accesion_id: number;
  nombre_variedad: string;
  codigo_accesion: string;
}
import type { AdminResumen, StatsPublicas } from '../types/admin';
import type { UsuarioInfo, LoginResponse, Tecnico, Propietario, Donante } from '../types/auth';
import type { Foto } from '../types/foto';

// Re-exportar todos los tipos para compatibilidad con consumidores existentes
export type {
  AccesionResumen, DetalleAccesion, PlantaConEvaluaciones, CrearAccesionData, BusquedaResultado,
  Enfermedad, Tratamiento, Deteccion, DeteccionInvestigacion, EnfermedadAdmin, TratamientoAdmin, EnfermedadResumen,
  Noticia, NoticiaAdmin,
  ProductoAdmin, ProductoResumen,
  SolicitudAdmin, SolicitudItem,
  InventarioItem,
  AdminResumen, StatsPublicas,
  UsuarioInfo, LoginResponse, Tecnico, Propietario, Donante,
  Foto,
};

// -- Endpoints --

export function listarAccesiones(): Promise<AccesionResumen[]> {
  return fetchJSON<AccesionResumen[]>('accesiones.php');
}

export function detalleAccesion(codigo: string): Promise<DetalleAccesion> {
  return fetchJSON<DetalleAccesion>(`accesion.php?codigo=${encodeURIComponent(codigo)}`);
}

// -- Admin: Accesiones CRUD --

export function listarTecnicos(): Promise<Tecnico[]> {
  return fetchAuthJSON<Tecnico[]>('admin/tecnicos.php');
}

export function listarPropietarios(): Promise<Propietario[]> {
  return fetchAuthJSON<Propietario[]>('admin/propietarios.php');
}

export function listarDonantes(): Promise<Donante[]> {
  return fetchAuthJSON<Donante[]>('admin/donantes.php');
}

export function crearAccesion(
  data: CrearAccesionData,
): Promise<{ success: boolean; id: number; codigo_accesion: string }> {
  return fetchAuthJSON('admin/crear-accesion.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function actualizarAccesion(
  data: CrearAccesionData & { id: number },
): Promise<{ success: boolean; id: number }> {
  return fetchAuthJSON('admin/actualizar-accesion.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function eliminarAccesion(id: number): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/eliminar-accesion.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

export function listarDetecciones(): Promise<DeteccionInvestigacion[]> {
  return fetchJSON<DeteccionInvestigacion[]>('detecciones.php');
}

export function listarEnfermedades(): Promise<Enfermedad[]> {
  return fetchJSON<Enfermedad[]>('enfermedades.php');
}

export function buscar(termino: string): Promise<BusquedaResultado[]> {
  return fetchJSON<BusquedaResultado[]>(`buscar.php?q=${encodeURIComponent(termino)}`);
}

export function listarNoticias(): Promise<Noticia[]> {
  return fetchJSON<Noticia[]>('noticias.php');
}

// -- Admin: Noticias CRUD --

export function listarNoticiasAdmin(): Promise<NoticiaAdmin[]> {
  return fetchAuthJSON<NoticiaAdmin[]>('admin/noticias.php');
}

export function crearNoticia(data: {
  titulo: string;
  contenido: string;
  foto_url?: string;
}): Promise<{ success: boolean; id: number }> {
  return fetchAuthJSON('admin/crear-noticia.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function actualizarNoticia(data: {
  id: number;
  titulo: string;
  contenido: string;
  foto_url?: string;
}): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/actualizar-noticia.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function eliminarNoticia(id: number): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/eliminar-noticia.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

// -- Admin: Enfermedades CRUD --

export function listarEnfermedadesAdmin(): Promise<EnfermedadAdmin[]> {
  return fetchAuthJSON<EnfermedadAdmin[]>('admin/enfermedades.php');
}

export function crearEnfermedad(data: {
  nombre_cientifico: string;
  nombre_comun?: string;
  tipo?: string;
  sintomas?: string;
  condiciones_propagacion?: string;
  tratamientos?: Omit<TratamientoAdmin, 'id'>[];
}): Promise<{ success: boolean; id: number }> {
  return fetchAuthJSON('admin/crear-enfermedad.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function actualizarEnfermedad(data: {
  id: number;
  nombre_cientifico: string;
  nombre_comun?: string;
  tipo?: string;
  sintomas?: string;
  condiciones_propagacion?: string;
  tratamientos?: Omit<TratamientoAdmin, 'id'>[];
}): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/actualizar-enfermedad.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function eliminarEnfermedad(id: number): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/eliminar-enfermedad.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

// -- Admin: Productos CRUD --

export function crearProducto(data: {
  nombre: string;
  tipo?: string;
  descripcion?: string;
  proceso_obtencion?: string;
  ingredientes?: string;
  fotografia_url?: string;
}): Promise<{ success: boolean; id: number }> {
  return fetchAuthJSON('admin/crear-producto.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function actualizarProducto(data: {
  id: number;
  nombre: string;
  tipo?: string;
  descripcion?: string;
  proceso_obtencion?: string;
  ingredientes?: string;
  fotografia_url?: string;
}): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/actualizar-producto.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function eliminarProducto(id: number): Promise<{ success: boolean }> {
  return fetchAuthJSON('admin/eliminar-producto.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

export function statsPublicas(): Promise<StatsPublicas> {
  return fetchJSON<StatsPublicas>('stats.php');
}

export function listarInventario(): Promise<InventarioItem[]> {
  return fetchAuthJSON<InventarioItem[]>('admin/listar-inventario.php');
}

export function crearInventario(data: {
  codigo_ubicacion: string;
  cantidad_disponible: number;
  unidad: string;
  accesion_id: number;
}): Promise<{ mensaje: string; id: number }> {
  return fetchAuthJSON('admin/crear-inventario.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function actualizarInventario(data: {
  id: number;
  codigo_ubicacion: string;
  cantidad_disponible: number;
  unidad: string;
  accesion_id: number;
}): Promise<{ mensaje: string }> {
  return fetchAuthJSON('admin/actualizar-inventario.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function eliminarInventario(id: number): Promise<{ mensaje: string }> {
  return fetchAuthJSON('admin/eliminar-inventario.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

// -- Solicitudes Admin --
export function eliminarSolicitud(id: number): Promise<{ mensaje: string }> {
  return fetchAuthJSON('admin/eliminar-solicitud.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}

// -- Auth --

export function login(email: string, password: string): Promise<LoginResponse> {
  return fetchJSON<LoginResponse>('login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registro(data: {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  cedula?: string;
  finca?: string;
  direccion?: string;
}): Promise<LoginResponse> {
  return fetchJSON<LoginResponse>('registro.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function estaAutenticado(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function getUsuario(): UsuarioInfo | null {
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// -- Admin --

export function listarSolicitudesAdmin(): Promise<SolicitudAdmin[]> {
  return fetchAuthJSON<SolicitudAdmin[]>('admin/solicitudes.php');
}

export function actualizarSolicitud(data: {
  id: number;
  estado: string;
  observaciones?: string;
}): Promise<{ mensaje: string }> {
  return fetchAuthJSON('admin/solicitud.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function adminResumen(): Promise<AdminResumen> {
  return fetchAuthJSON<AdminResumen>('admin/resumen.php');
}

export function solicitarSemillas(data: {
  nombre: string;
  email: string;
  telefono?: string;
  cedula?: string;
  finca?: string;
  direccion?: string;
  items: { accesion_id: number; cantidad: number; unidad?: string }[];
}): Promise<{ mensaje: string; numero_seguimiento: string; solicitud_id: string }> {
  return fetchJSON('solicitar.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function listarInventarioDisponible(): Promise<InventarioDisponible[]> {
  return fetchJSON<InventarioDisponible[]>('inventario-disponible.php');
}

export function misSolicitudes(): Promise<SolicitudItem[]> {
  return fetchAuthJSON<SolicitudItem[]>('mis-solicitudes.php');
}

// -- Enfermedades y Productos (para selector de fotos) --

export function listarEnfermedadesResumen(): Promise<EnfermedadResumen[]> {
  return fetchJSON<EnfermedadResumen[]>('enfermedades.php');
}

export function listarProductos(): Promise<ProductoResumen[]> {
  return fetchJSON<ProductoResumen[]>('productos.php');
}

// -- Fotos --

export function listarFotos(tipo?: string, id?: number): Promise<Foto[]> {
  let endpoint = 'fotos.php';
  const params = [];
  if (tipo) params.push(`tipo=${encodeURIComponent(tipo)}`);
  if (id) params.push(`id=${id}`);
  if (params.length) endpoint += '?' + params.join('&');
  return fetchJSON<Foto[]>(endpoint);
}

export function subirFoto(
  file: File,
  entidad_tipo: string,
  entidad_id: number,
  descripcion?: string,
): Promise<{ mensaje: string; id: number; url: string }> {
  const token = getToken();
  if (!token) return Promise.reject(new Error('No autenticado'));

  const formData = new FormData();
  formData.append('file', file);
  formData.append('entidad_tipo', entidad_tipo);
  formData.append('entidad_id', entidad_id.toString());
  if (descripcion) formData.append('descripcion', descripcion);

  return fetch(`${API_BASE}/subir-foto.php`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    if (res.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/admin';
      throw new Error('Sesion expirada');
    }
    if (!res.ok) {
      throw new Error(await extractResponseError(res));
    }
    return res.json();
  });
}

export function actualizarFoto(id: number, descripcion: string): Promise<{ mensaje: string }> {
  return fetchAuthJSON('actualizar-foto.php', {
    method: 'POST',
    body: JSON.stringify({ id, descripcion }),
  });
}

export function eliminarFoto(id: number): Promise<{ mensaje: string }> {
  return fetchAuthJSON('eliminar-foto.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}
