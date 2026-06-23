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

export interface Deteccion {
  enfermedad: string;
  nivel_incidencia: string;
  metodo_deteccion: string;
  fecha_deteccion: string;
  provincia: string;
}

export interface DeteccionInvestigacion {
  id: number;
  codigo_accesion: string;
  enfermedad: string;
  nivel_incidencia: string;
  metodo_deteccion: string;
  fecha_deteccion: string;
  provincia: string;
  variedad: string;
}

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

export interface EnfermedadResumen {
  id: number;
  nombre_cientifico: string;
  nombre_comun: string;
  tipo: string;
}
