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

export interface SolicitudItem {
  id: number;
  numero_seguimiento: string;
  estado: string;
  fecha: string;
  observaciones: string;
  items: { codigo: string; cropname: string; cantidad: number; unidad: string }[];
}
