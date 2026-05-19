const request = require('supertest');

let app;
beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.NODE_ENV = 'test';
  app = require('../../src/app');
});

describe('GET /api', () => {
  it('should return API status message', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('funcionando');
  });
});

describe('POST /api/auth/login', () => {
  it('should return 400 for missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('should return 400 for empty username', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: '', password: '123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/register', () => {
  it('should return 400 for empty body', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/countries/active', () => {
  it('should return list of active countries', async () => {
    const res = await request(app).get('/api/countries/active');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/news/public/:countrySlug', () => {
  it('should return 200 with array for valid country', async () => {
    const res = await request(app).get('/api/news/public/argentina');
    expect(res.status).toBe(200);
  });
});

describe('GET /api/testimonials/public/:countrySlug', () => {
  it('should return 200 with array for valid country', async () => {
    const res = await request(app).get('/api/testimonials/public/argentina');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/contact-requests/public', () => {
  it('should return 400 if missing required fields', async () => {
    const res = await request(app).post('/api/contact-requests/public').send({});
    expect(res.status).toBe(400);
  });

  it('should return 400 if invalid email', async () => {
    const res = await request(app).post('/api/contact-requests/public').send({
      pais_id: 1, nombre: 'Test', correo: 'invalido', telefono: '123', finalidad: 'Servicio',
    });
    expect(res.status).toBe(400);
  });
});

describe('Protected routes', () => {
  it('should return 401 for /api/users without token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('should return 401 for /api/news without token', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(401);
  });

  it('should return 401 for /api/connection-logs without token', async () => {
    const res = await request(app).get('/api/connection-logs');
    expect(res.status).toBe(401);
  });

  it('should reject invalid token with 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/categorias', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/categorias');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/estadisticas-pais', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/estadisticas-pais');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auditoria', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auditoria');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/archivos', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/archivos');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/historial-noticias/noticia/1', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/historial-noticias/noticia/1');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/comentarios', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/comentarios');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/notificaciones', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/notificaciones');
    expect(res.status).toBe(401);
  });
});
