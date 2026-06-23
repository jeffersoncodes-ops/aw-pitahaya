export interface Foto {
  id: number;
  entidad_tipo: string;
  entidad_id: number;
  url: string;
  descripcion: string | null;
  es_principal: boolean;
  creado_en: string;
}
