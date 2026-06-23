export interface ProductoAdmin {
  id: number;
  nombre: string;
  tipo: string | null;
  descripcion: string | null;
  proceso_obtencion: string | null;
  ingredientes: string | null;
  fotografia_url: string | null;
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
