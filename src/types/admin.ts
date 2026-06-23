export interface StatsPublicas {
  total_accesiones: number;
  total_enfermedades: number;
  total_productos: number;
  total_noticias: number;
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
