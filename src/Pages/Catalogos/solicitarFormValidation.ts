export interface SolicitarFormValues {
  nombre: string;
  email: string;
  telefono: string;
  finca: string;
  direccion: string;
}

export type FormErrors = Partial<Record<keyof SolicitarFormValues, string>>;

export function validateNombre(nombre: string): string | undefined {
  if (!nombre.trim()) return 'El nombre es obligatorio';
  if (nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'El correo electrónico es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Correo electrónico no válido';
  return undefined;
}

const TELEFONO_REGEX = /^\+?[\d\s()-]{7,15}$/;

export function validateTelefono(telefono: string): string | undefined {
  if (!telefono.trim()) return undefined;
  if (!TELEFONO_REGEX.test(telefono.trim())) return 'Teléfono no válido';
  return undefined;
}

export function validateSolicitarForm(values: SolicitarFormValues): FormErrors {
  const errors: FormErrors = {};
  const nombreErr = validateNombre(values.nombre);
  if (nombreErr) errors.nombre = nombreErr;
  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;
  const telefonoErr = validateTelefono(values.telefono);
  if (telefonoErr) errors.telefono = telefonoErr;
  return errors;
}
