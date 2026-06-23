import {
  listarAccesiones,
  listarNoticias,
  listarEnfermedades,
  buscar,
  statsPublicas,
  listarProductos,
  login,
  registro,
  listarTecnicos,
  listarSolicitudesAdmin,
} from './api';

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  globalThis.fetch = mockFetch;
  localStorage.clear();
});

function mockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response;
}

function mockError(message: string, status = 500) {
  return mockResponse({ error: message }, status);
}

// ─── Public endpoints (fetchJSON) ───────────────────────────────

describe('listarAccesiones', () => {
  it('llama a /api/accesiones.php y retorna datos', async () => {
    const datos = [
      {
        id: 1,
        codigo_accesion: 'EI-PIT-26-001',
        cropname: 'Pitahaya',
        accename: 'Orejona',
        variedad: 'Roja',
        provincia: 'Loja',
        genus: 'Hylocereus',
        species: 'undatus',
        latitude: '-4.0',
        longitude: '-79.2',
        elevation: 1500,
        tecnico: 'Juan',
        propietario: 'Maria',
      },
    ];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await listarAccesiones();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/accesiones.php',
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } }),
    );
  });

  it('lanza error cuando la API falla', async () => {
    mockFetch.mockResolvedValue(mockError('Error interno', 500));

    await expect(listarAccesiones()).rejects.toThrow('Error interno');
  });
});

describe('listarNoticias', () => {
  it('llama a /api/noticias.php y retorna datos', async () => {
    const datos = [
      {
        id: 1,
        titulo: 'Nueva variedad',
        contenido: 'Contenido',
        foto_url: null,
        fecha: '2025-01-01',
        autor: 'Admin',
      },
    ];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await listarNoticias();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith('/api/noticias.php', expect.any(Object));
  });
});

describe('listarEnfermedades', () => {
  it('llama a /api/enfermedades.php y retorna datos', async () => {
    const datos = [
      {
        id: 1,
        nombre_cientifico: 'Fusarium oxysporum',
        nombre_comun: 'Fusarium',
        tipo: 'Hongo',
        sintomas: 'Marchitez',
        tratamientos: null,
      },
    ];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await listarEnfermedades();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith('/api/enfermedades.php', expect.any(Object));
  });
});

describe('buscar', () => {
  it('llama a /api/buscar.php?q= con el termino', async () => {
    const datos = [
      {
        codigo_accesion: 'EI-PIT-26-001',
        accename: 'Orejona',
        cropname: 'Pitahaya',
        provincia: 'Loja',
        variedad: 'Roja',
        relevancia: 0.95,
      },
    ];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await buscar('pitahaya');

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/buscar.php?q=pitahaya',
      expect.any(Object),
    );
  });

  it('codifica caracteres especiales en la busqueda', async () => {
    mockFetch.mockResolvedValue(mockResponse([]));

    await buscar('término acentuado');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/buscar.php?q=t%C3%A9rmino%20acentuado',
      expect.any(Object),
    );
  });
});

describe('statsPublicas', () => {
  it('llama a /api/stats.php y retorna datos', async () => {
    const datos = {
      total_accesiones: 42,
      total_enfermedades: 10,
      total_productos: 5,
      total_noticias: 8,
    };
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await statsPublicas();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith('/api/stats.php', expect.any(Object));
  });
});

describe('listarProductos', () => {
  it('llama a /api/productos.php y retorna datos', async () => {
    const datos = [
      {
        id: 1,
        nombre: 'Mermelada de pitahaya',
        tipo: 'Alimento',
        descripcion: 'Dulce artesanal',
        proceso_obtencion: null,
        ingredientes: null,
        fotografia_url: null,
      },
    ];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await listarProductos();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith('/api/productos.php', expect.any(Object));
  });
});

// ─── Auth endpoints (fetchJSON + POST) ─────────────────────────

describe('login', () => {
  it('envia POST con email y password', async () => {
    const respuesta = {
      token: 'jwt-token',
      usuario: { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin' },
    };
    mockFetch.mockResolvedValue(mockResponse(respuesta));

    const result = await login('admin@test.com', 'secreta');

    expect(result).toEqual(respuesta);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/login.php',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
});

describe('registro', () => {
  it('envia POST con datos de registro', async () => {
    const respuesta = {
      token: 'jwt-token',
      usuario: { id: 2, nombre: 'Nuevo', email: 'nuevo@test.com', rol: 'productor' },
    };
    mockFetch.mockResolvedValue(mockResponse(respuesta));

    const result = await registro({
      nombre: 'Nuevo',
      email: 'nuevo@test.com',
      password: 'clave123',
    });

    expect(result).toEqual(respuesta);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/registro.php',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });
});

// ─── Protected endpoints (fetchAuthJSON) ───────────────────────

describe('listarTecnicos', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('llama a /api/admin/tecnicos.php con token Bearer', async () => {
    const datos = [{ id: 1, nombre: 'Tecnico', correo: 't@test.com', cargo: 'Jefe' }];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await listarTecnicos();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/admin/tecnicos.php',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      }),
    );
  });
});

describe('listarSolicitudesAdmin', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('llama a /api/admin/solicitudes.php con token', async () => {
    const datos = [
      {
        id: 1,
        numero_seguimiento: 'SOL-001',
        solicitante_nombre: 'Juan',
        solicitante_email: 'j@test.com',
        solicitante_telefono: '0999999999',
        solicitante_cedula: '1101',
        solicitante_finca: 'Finca',
        estado: 'pendiente',
        fecha: '2025-01-01',
        atendido_por: null,
        observaciones: '',
        items: [{ codigo: 'EI-PIT-26-001', cropname: 'Pitahaya', cantidad: 10 }],
      },
    ];
    mockFetch.mockResolvedValue(mockResponse(datos));

    const result = await listarSolicitudesAdmin();

    expect(result).toEqual(datos);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/admin/solicitudes.php',
      expect.any(Object),
    );
  });
});

// ─── Error handling ─────────────────────────────────────────────

describe('manejo de errores HTTP', () => {
  it('fetchJSON lanza error con mensaje del servidor (500)', async () => {
    mockFetch.mockResolvedValue(mockError('Error del servidor', 500));

    await expect(listarNoticias()).rejects.toThrow('Error del servidor');
  });

  it('fetchAuthJSON lanza Sesion expirada en 401, limpia token y redirige', async () => {
    localStorage.setItem('auth_token', 'token-valido');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));
    mockFetch.mockResolvedValue(mockError('No autorizado', 401));

    await expect(listarTecnicos()).rejects.toThrow('Sesion expirada');
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  it('fetchAuthJSON lanza error generico en 500', async () => {
    localStorage.setItem('auth_token', 'token-valido');
    mockFetch.mockResolvedValue(mockError('Error interno', 500));

    await expect(listarTecnicos()).rejects.toThrow('Error interno');
  });

  it('fetchAuthJSON lanza No autenticado cuando falta token', async () => {
    // No localStorage token set (already cleared in beforeEach)
    await expect(listarTecnicos()).rejects.toThrow('No autenticado');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('fetchJSON maneja error de red (fetch rechazado)', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    await expect(listarNoticias()).rejects.toThrow('Network failure');
  });
});

// ─── Headers ────────────────────────────────────────────────────

describe('encabezados Content-Type', () => {
  it('fetchJSON incluye Content-Type application/json', async () => {
    mockFetch.mockResolvedValue(mockResponse({}));
    await listarAccesiones();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('fetchAuthJSON incluye Content-Type y Authorization', async () => {
    localStorage.setItem('auth_token', 'token-xyz');
    mockFetch.mockResolvedValue(mockResponse({}));
    await listarTecnicos();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-xyz',
        },
      }),
    );
  });
});
