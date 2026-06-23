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
