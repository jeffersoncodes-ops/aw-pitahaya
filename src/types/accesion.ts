import type { Deteccion } from './enfermedad';

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
  tecnico_id: number;
  propietario_id: number;
  donante_id: number | null;
  tecnico: string;
  propietario: string;
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

export interface BusquedaResultado {
  codigo_accesion: string;
  accename: string;
  cropname: string;
  provincia: string;
  variedad: string;
  relevancia: number;
}
