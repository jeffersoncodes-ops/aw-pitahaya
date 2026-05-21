const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Error ${res.status}`);
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/admin';
    throw new Error('Sesion expirada');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Error ${res.status}`);
  }

  return res.json();
}

// -- Tipos --

export interface AccesionResumen {
  id: number;
  codigo_accesion: string;
  cropname: string;
  accename: string;
  variedad: string;
  provincia: string;
  genus: string;
  species: string;
  latitude: string;
  longitude: string;
  elevation: number;
  tecnico: string;
  propietario: string;
}

export interface Tratamiento {
  nombre: string;
  tipo: string;
  descripcion: string;
  dosis: string;
  frecuencia: string;
}

export interface Enfermedad {
  id: number;
  nombre_cientifico: string;
  nombre_comun: string;
  tipo: string;
  sintomas: string;
  tratamientos: Tratamiento[] | null;
}

export interface DetalleAccesion extends AccesionResumen {
  id: number;
  instcode: string;
  collnumb: string;
  collcode: string;
  spauthor: string | null;
  subtaxa: string | null;
  acqdate: string;
  origcty: string;
  collsite: string;
  elevation: number;
  colldate: string;
  sampstat: string;
  collsrc: string;
  storage: string;
  remarks: string;
  tipo_suelo: string;
  correo_tecnico: string;
  donante: string | null;
  plantas: PlantaConEvaluaciones[];
  detecciones: Deteccion[];
}

export interface PlantaConEvaluaciones {
  codigo_planta: string;
  evaluaciones: {
    vegetativa: Record<string, unknown> | null;
    floral: Record<string, unknown> | null;
    fruto: Record<string, unknown> | null;
    sanidad: Record<string, unknown> | null;
  };
}

export interface Deteccion {
  enfermedad: string;
  nivel_incidencia: string;
  metodo_deteccion: string;
  fecha_deteccion: string;
  provincia: string;
}

export interface BusquedaResultado {
  codigo_accesion: string;
  accename: string;
  cropname: string;
  provincia: string;
  variedad: string;
  relevancia: number;
}

// -- Endpoints --

export function listarAccesiones(): Promise<AccesionResumen[]> {
  return fetchJSON<AccesionResumen[]>('accesiones.php');
}

export function detalleAccesion(codigo: string): Promise<DetalleAccesion> {
  return fetchJSON<DetalleAccesion>(`accesion.php?codigo=${encodeURIComponent(codigo)}`);
}

// -- Admin: Accesiones CRUD --

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

export function listarTecnicos(): Promise<Tecnico[]> {
  return fetchAuthJSON<Tecnico[]>('admin/tecnicos.php');
}

export function listarPropietarios(): Promise<Propietario[]> {
  return fetchAuthJSON<Propietario[]>('admin/propietarios.php');
}

export function listarDonantes(): Promise<Donante[]> {
  return fetchAuthJSON<Donante[]>('admin/donantes.php');
}

export interface CrearAccesionData {
  codigo_accesion: string;
  cropname?: string;
  accename?: string;
  variedad?: string;
  provincia?: string;
  genus?: string;
  species?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  tecnico_id: number;
  propietario_id: number;
  donante_id?: number;
  acqdate?: string;
  colldate?: string;
  collsite?: string;
  origcty?: string;
  tipo_suelo?: string;
  collnumb?: string;
  collcode?: string;
  instcode?: string;
  remarks?: string;
  sampstat?: string;
  collsrc?: string;
  storage?: string;
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

export function listarEnfermedades(): Promise<Enfermedad[]> {
  return fetchJSON<Enfermedad[]>('enfermedades.php');
}

export function buscar(termino: string): Promise<BusquedaResultado[]> {
  return fetchJSON<BusquedaResultado[]>(`buscar.php?q=${encodeURIComponent(termino)}`);
}

export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  foto_url: string | null;
  fecha: string;
  autor: string;
}

export function listarNoticias(): Promise<Noticia[]> {
  return fetchJSON<Noticia[]>('noticias.php');
}

// -- Admin: Noticias CRUD --

export interface NoticiaAdmin extends Noticia {
  activo: boolean;
}

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

export interface TratamientoAdmin {
  id?: number;
  nombre_tratamiento: string;
  tipo_tratamiento?: string;
  descripcion?: string;
  dosis?: string;
  frecuencia?: string;
}

export interface EnfermedadAdmin {
  id: number;
  nombre_cientifico: string;
  nombre_comun: string | null;
  tipo: string | null;
  sintomas: string | null;
  condiciones_propagacion: string | null;
  tratamientos: TratamientoAdmin[];
}

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

export interface ProductoAdmin {
  id: number;
  nombre: string;
  tipo: string | null;
  descripcion: string | null;
  proceso_obtencion: string | null;
  ingredientes: string | null;
  fotografia_url: string | null;
}

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

export interface StatsPublicas {
  total_accesiones: number;
  total_enfermedades: number;
  total_productos: number;
  total_noticias: number;
}

export function statsPublicas(): Promise<StatsPublicas> {
  return fetchJSON<StatsPublicas>('stats.php');
}

export interface AdminResumen {
  solicitudes: {
    id: number;
    numero_seguimiento: string;
    solicitante_nombre: string;
    solicitante_email: string;
    estado: string;
    fecha: string;
    items: number;
  }[];
  inventario: {
    id: number;
    accesion_id: number;
    codigo_ubicacion: string;
    cantidad_disponible: number;
    unidad: string | null;
    codigo_accesion: string;
    cropname: string;
    variedad: string;
  }[];
  totals: {
    total_accesiones: number;
    total_solicitudes: number;
    pendientes: number;
    total_enfermedades: number;
  };
}

// -- Inventario --
export interface InventarioItem {
  id: number;
  accesion_id: number;
  codigo_ubicacion: string;
  cantidad_disponible: number;
  unidad?: string | null;
  fecha_ingreso?: string | null;
  fecha_actualizacion?: string | null;
  codigo_accesion: string;
  cropname: string;
  variedad: string;
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
  return !!localStorage.getItem('auth_token');
}

export function getUsuario(): UsuarioInfo | null {
  const raw = localStorage.getItem('auth_user');
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

// -- Admin --

export interface SolicitudAdmin {
  id: number;
  numero_seguimiento: string;
  solicitante_nombre: string;
  solicitante_email: string;
  solicitante_telefono: string;
  solicitante_cedula: string;
  solicitante_finca: string;
  estado: string;
  fecha: string;
  atendido_por: string | null;
  observaciones: string;
  items: { codigo: string; cropname: string; cantidad: number }[];
}

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

export interface SolicitudItem {
  id: number;
  numero_seguimiento: string;
  estado: string;
  fecha: string;
  observaciones: string;
  items: { codigo: string; cropname: string; cantidad: number; unidad: string }[];
}

export function misSolicitudes(): Promise<SolicitudItem[]> {
  return fetchAuthJSON<SolicitudItem[]>('mis-solicitudes.php');
}

// -- Enfermedades y Productos (para selector de fotos) --

export interface EnfermedadResumen {
  id: number;
  nombre_cientifico: string;
  nombre_comun: string;
  tipo: string;
}

export function listarEnfermedadesResumen(): Promise<EnfermedadResumen[]> {
  return fetchJSON<EnfermedadResumen[]>('enfermedades.php');
}

export interface ProductoResumen {
  id: number;
  nombre: string;
  tipo: string | null;
  descripcion: string | null;
  proceso_obtencion: string | null;
  ingredientes: string | null;
  fotografia_url: string | null;
}

export function listarProductos(): Promise<ProductoResumen[]> {
  return fetchJSON<ProductoResumen[]>('productos.php');
}

// -- Fotos --

export interface Foto {
  id: number;
  entidad_tipo: string;
  entidad_id: number;
  url: string;
  descripcion: string | null;
  es_principal: boolean;
  creado_en: string;
}

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
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entidad_tipo', entidad_tipo);
  formData.append('entidad_id', entidad_id.toString());
  if (descripcion) formData.append('descripcion', descripcion);

  return fetch(`${API_BASE}/subir-foto.php`, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
  });
}

export function actualizarFoto(id: number, descripcion: string): Promise<{ mensaje: string }> {
  return fetchJSON('actualizar-foto.php', {
    method: 'POST',
    body: JSON.stringify({ id, descripcion }),
  });
}

export function eliminarFoto(id: number): Promise<{ mensaje: string }> {
  return fetchJSON('eliminar-foto.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
}
