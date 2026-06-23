export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  foto_url: string | null;
  fecha: string;
  autor: string;
}

export interface NoticiaAdmin extends Noticia {
  activo: boolean;
}
