import { describe, it, expect } from 'vitest';
import { validateNombre, validateEmail, validateTelefono, validateSolicitarForm } from './solicitarFormValidation';

describe('validateNombre', () => {
  it('returns error when nombre is empty', () => {
    expect(validateNombre('')).toBe('El nombre es obligatorio');
  });

  it('returns error when nombre is only whitespace', () => {
    expect(validateNombre('   ')).toBe('El nombre es obligatorio');
  });

  it('returns error when nombre is shorter than 2 characters', () => {
    expect(validateNombre('A')).toBe('El nombre debe tener al menos 2 caracteres');
  });

  it('returns undefined for valid nombre with 2+ characters', () => {
    expect(validateNombre('Juan Pérez')).toBeUndefined();
  });
});

describe('validateEmail', () => {
  it('returns error when email is empty', () => {
    expect(validateEmail('')).toBe('El correo electrónico es obligatorio');
  });

  it('returns error when email has no @ symbol', () => {
    expect(validateEmail('correo')).toBe('Correo electrónico no válido');
  });

  it('returns error when email has no domain', () => {
    expect(validateEmail('correo@')).toBe('Correo electrónico no válido');
  });

  it('returns error when email has no TLD', () => {
    expect(validateEmail('correo@dominio')).toBe('Correo electrónico no válido');
  });

  it('returns undefined for a valid email', () => {
    expect(validateEmail('test@example.com')).toBeUndefined();
  });

  it('returns undefined for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeUndefined();
  });
});

describe('validateTelefono', () => {
  it('returns undefined when telefono is empty (optional field)', () => {
    expect(validateTelefono('')).toBeUndefined();
  });

  it('returns undefined when telefono is whitespace only (optional field)', () => {
    expect(validateTelefono('   ')).toBeUndefined();
  });

  it('returns error for telefono that is too short', () => {
    expect(validateTelefono('123')).toBe('Teléfono no válido');
  });

  it('returns error for telefono with letters', () => {
    expect(validateTelefono('ABC-1234')).toBe('Teléfono no válido');
  });

  it('returns undefined for valid phone with dashes', () => {
    expect(validateTelefono('809-555-1234')).toBeUndefined();
  });

  it('returns undefined for valid phone with spaces', () => {
    expect(validateTelefono('809 555 1234')).toBeUndefined();
  });

  it('returns undefined for valid phone with international prefix', () => {
    expect(validateTelefono('+1 809 555 1234')).toBeUndefined();
  });

  it('returns undefined for valid 7-digit local number', () => {
    expect(validateTelefono('5551234')).toBeUndefined();
  });
});

describe('validateSolicitarForm', () => {
  it('returns errors for empty required fields', () => {
    const errors = validateSolicitarForm({ nombre: '', email: '', telefono: '', finca: '', direccion: '' });
    expect(errors.nombre).toBe('El nombre es obligatorio');
    expect(errors.email).toBe('El correo electrónico es obligatorio');
    expect(errors.telefono).toBeUndefined();
  });

  it('returns no errors for valid complete form', () => {
    const errors = validateSolicitarForm({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '809-555-1234',
      finca: 'Mi Finca',
      direccion: 'Calle Principal 123',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns email error for invalid email format', () => {
    const errors = validateSolicitarForm({ nombre: 'Juan', email: 'invalido', telefono: '', finca: '', direccion: '' });
    expect(errors.email).toBe('Correo electrónico no válido');
  });

  it('returns error for nombre shorter than 2 chars', () => {
    const errors = validateSolicitarForm({ nombre: 'J', email: 'j@j.com', telefono: '', finca: '', direccion: '' });
    expect(errors.nombre).toBe('El nombre debe tener al menos 2 caracteres');
  });
});
