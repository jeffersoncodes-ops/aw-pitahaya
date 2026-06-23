export const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const STATUS_MAP = {
  pendiente: 'warning',
  aprobada: 'success',
  rechazada: 'error',
  entregada: 'info',
} as const;

export const WHATSAPP_NUMBER = '593967965394';

export const WHATSAPP_MESSAGE = encodeURIComponent('Hola, tengo una consulta sobre la pitahaya');

export const ACCEPT_TYPES = ['Semilla', 'Esqueje', 'Planta', 'Polen'] as const;

export const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export const DEMO_CREDENTIALS = {
  email: 'admin@pitahaya.gob.ec',
  password: 'admin123',
};
