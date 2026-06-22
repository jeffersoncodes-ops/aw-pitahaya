export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function validateLoginEmail(email: string): string | undefined {
  if (!email.trim()) return 'El correo electrónico es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Correo electrónico no válido';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return undefined;
}

export function validateLoginForm(email: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailErr = validateLoginEmail(email);
  if (emailErr) errors.email = emailErr;
  const passwordErr = validatePassword(password);
  if (passwordErr) errors.password = passwordErr;
  return errors;
}
