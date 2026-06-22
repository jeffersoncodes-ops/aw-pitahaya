import { describe, it, expect } from 'vitest';
import { validateLoginEmail, validatePassword, validateLoginForm } from './loginValidation';

describe('validateLoginEmail', () => {
  it('returns error when email is empty', () => {
    expect(validateLoginEmail('')).toBe('El correo electrónico es obligatorio');
  });

  it('returns error when email has no @ symbol', () => {
    expect(validateLoginEmail('correo')).toBe('Correo electrónico no válido');
  });

  it('returns error when email has no domain', () => {
    expect(validateLoginEmail('correo@')).toBe('Correo electrónico no válido');
  });

  it('returns error when email has no TLD', () => {
    expect(validateLoginEmail('correo@dominio')).toBe('Correo electrónico no válido');
  });

  it('returns undefined for a valid email', () => {
    expect(validateLoginEmail('admin@example.com')).toBeUndefined();
  });
});

describe('validatePassword', () => {
  it('returns error when password is empty', () => {
    expect(validatePassword('')).toBe('La contraseña es obligatoria');
  });

  it('returns error when password is shorter than 6 characters', () => {
    expect(validatePassword('abc12')).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('returns undefined for password with 6+ characters', () => {
    expect(validatePassword('123456')).toBeUndefined();
  });

  it('returns undefined for a long valid password', () => {
    expect(validatePassword('Pitahaya2024!')).toBeUndefined();
  });
});

describe('validateLoginForm', () => {
  it('returns errors for empty email and password', () => {
    const errors = validateLoginForm('', '');
    expect(errors.email).toBe('El correo electrónico es obligatorio');
    expect(errors.password).toBe('La contraseña es obligatoria');
  });

  it('returns email error for invalid format', () => {
    const errors = validateLoginForm('invalido', '123456');
    expect(errors.email).toBe('Correo electrónico no válido');
    expect(errors.password).toBeUndefined();
  });

  it('returns password error when too short', () => {
    const errors = validateLoginForm('admin@test.com', 'abc');
    expect(errors.email).toBeUndefined();
    expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('returns no errors for valid credentials', () => {
    const errors = validateLoginForm('admin@pitahaya.com', 'Admin123');
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
