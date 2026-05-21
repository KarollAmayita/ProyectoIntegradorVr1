# CMS Multipaís

API REST + Frontend para sistema de gestión de contenidos multi-país desarrollado con Express, Supabase y **Arquitectura Hexagonal**.

## Descripción

Sistema CMS multi-país que permite gestionar contenidos (noticias, testimonios, solicitudes de contacto) por país, con autenticación JWT, refresh tokens, control de acceso basado en roles (RBAC), portal público por país y recuperación de contraseña con pregunta de seguridad.

### Demo online

[http://149.130.163.194:3001/](http://149.130.163.194:3001/)

### Países disponibles

| País | Código | Slug |
|------|--------|------|
| Colombia | CO | colombia |
| Chile | CL | chile |
| Argentina | AR | argentina |
| Ecuador | EC | ecuador |

## Tecnologías

- Node.js + Express 5
- Supabase (PostgreSQL)
- JWT (jsonwebtoken) + bcryptjs
- Docker + docker-compose
- **Arquitectura Hexagonal** (Puertos y Adaptadores)

## Arquitectura

El backend sigue el patrón **Hexagonal (Puertos y Adaptadores)** con 4 capas + Composition Root:

```
┌──────────────────────────────────────────────────────────┐
│                    DRIVING ADAPTERS                       │
│    controllers + routes (HTTP) → Express                 │
│    backend/src/infrastructure/adapters/driving/http/      │
├──────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                      │
│    services + use-cases (lógica de negocio)              │
│    backend/src/application/                               │
├──────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                           │
│    entities (reglas de negocio)                          │
│    backend/src/domain/                                    │
├──────────────────────────────────────────────────────────┤
│                    PORTS (INTERFACES)                     │
│    contratos que definen la comunicación entre capas     │
│    backend/src/ports/<modulo>/outbound/                   │
├──────────────────────────────────────────────────────────┤
│                    DRIVEN ADAPTERS                        │
│    repositorios Supabase, JWT, bcrypt, storage           │
│    backend/src/infrastructure/adapters/driven/            │
└──────────────────────────────────────────────────────────┘
                    ↕ inyección de dependencias
          ┌─────────────────────────────────────┐
          │        COMPOSITION ROOT             │
          │  backend/src/infrastructure/        │
          │  composition-root.js                │
          │  (centraliza DI de todo el sistema) │
          └─────────────────────────────────────┘
```

## Estructura del proyecto

```
backend/
├── src/
│   ├── app-hexagonal.js           ← Entry point (alias app.js)
│   ├── application/               ← Lógica de negocio
│   │   ├── auth/auth-service.js
│   │   ├── news/news-service.js
│   │   ├── testimonial/  contact-request/  country/
│   │   ├── user/  categoria/  auditoria/
│   │   └── use-cases/           ← Casos de uso individuales
│   │       ├── archivos/  comentario/  notificacion/
│   │       ├── connection-log/  estadistica-pais/
│   │       ├── admin/  profile/  historial-noticia/
│   ├── domain/                    ← Entidades del negocio
│   │   ├── auth/user.js
│   │   ├── news/news.js
│   │   ├── testimonial/  contact-request/  country/
│   │   ├── categoria/  auditoria/  entities/
│   ├── ports/                     ← Interfaces (puertos outbound)
│   │   ├── auth/  news/  testimonial/  user/  country/
│   │   ├── categoria/  contact-request/  auditoria/
│   │   ├── repositories/  services/
│   ├── infrastructure/            ← Adaptadores + DI
│   │   ├── composition-root.js    ← Inyección de dependencias
│   │   └── adapters/
│   │       ├── driving/http/      ← Controladores + rutas Express
│   │       │   ├── auth-controller.js  auth-routes.js
│   │       │   ├── news-controller.js  news-routes.js
│   │       │   ├── ... (16 módulos)
│   │       └── driven/
│   │           ├── database/      ← Repositorios Supabase
│   │           ├── external/      ← JWT, bcrypt, logger
│   │           └── storage/       ← Supabase Storage
│   ├── config/                   ← supabase.js, swagger.js
│   ├── middlewares/              ← auth, role, validation, rateLimiter
│   ├── scripts/                  ← createSuperAdmin, seed, setup DB
│   ├── db/                       ← Esquemas SQL
│   └── utils/                    ← errors.js, versionador.js
├── tests/                        ← Tests unitarios + integración
├── .env.example
└── package.json

frontend/
├── admin/                        ← Panel admin (login, CRUD, dashboards)
│   ├── admin-styles.css
│   ├── admin-shared.js
│   └── *.html                    ← login, dashboards, noticias, etc.
├── portales/                     ← Portales públicos por país
│   ├── argentina/  chile/  colombia/  ecuador/  indice/
└── assets/img/
```

---

## Instalación rápida

```bash
cd backend
npm install
cp .env.example .env   # configurar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

> Ejecutar `backend/src/db/cms-multipais.sql` en SQL Editor de Supabase

```bash
node src/scripts/createSuperAdmin.js    # crea superadmin
node src/scripts/seedUsers.js           # (opcional) crea admin_pais + editor para cada país
```

**Seed de datos de portales** (noticias + testimonios para Colombia, Chile, Ecuador):
```bash
node src/scripts/seedPortalData.js
```

Servidor en `http://localhost:3001`

---

## Frontend

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Iniciar sesión |
| POST | /api/auth/register | No | Registrar usuario |
| POST | /api/auth/refresh-token | No | Renovar token |
| POST | /api/auth/logout | Sí | Cerrar sesión |
| POST | /api/auth/logout-all | Sí | Cerrar todas las sesiones |
| POST | /api/auth/session-end | No | Cierre automático (sendBeacon) |
| POST | /api/auth/security-question | No | Obtener pregunta de seguridad (público) |
| POST | /api/auth/forgot-password | No | Obtener pregunta de seguridad |
| POST | /api/auth/reset-password | No | Restaurar contraseña |
| PUT | /api/auth/change-password | Sí | Cambiar contraseña |
| PATCH | /api/auth/change-my-password | Sí | Cambiar contraseña (alias) |
| PATCH | /api/auth/security-question | Sí | Actualizar pregunta de seguridad |
| GET | /api/auth/security-question | Sí | Ver mi pregunta de seguridad |
| GET | /api/auth/me | Sí | Ver mi perfil |
| PATCH | /api/auth/me | Sí | Actualizar perfil propio |

### Países

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/countries | Sí | Listar (filtrado por rol) |
| GET | /api/countries/active | No | Solo activos |

### Noticias

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/news/public/:countrySlug | No | Noticias públicas por país |
| GET | /api/news/public/:countrySlug/:slug | No | Detalle público |
| GET | /api/news | Sí | Listar admin |
| POST | /api/news | Sí | Crear |
| GET | /api/news/:id | Sí | Obtener por ID |
| PUT | /api/news/:id | Sí | Actualizar |
| PATCH | /api/news/:id | Sí | Actualizar parcial |
| PATCH | /api/news/:id/estado | Sí | Cambiar estado |
| PATCH | /api/news/:id/imagen | Sí | Cambiar imagen |
| DELETE | /api/news/:id | Sí | Eliminar |

### Testimonios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/testimonials/public/:countrySlug | No | Testimonios públicos |
| POST | /api/testimonials/public | No | Enviar testimonio (público) |
| GET | /api/testimonials | Sí | Listar admin |
| POST | /api/testimonials | Sí | Crear |
| GET | /api/testimonials/:id | Sí | Obtener por ID |
| PUT | /api/testimonials/:id | Sí | Actualizar |
| PATCH | /api/testimonials/:id | Sí | Actualizar parcial |
| PATCH | /api/testimonials/:id/estado | Sí | Cambiar estado |
| PATCH | /api/testimonials/:id/foto | Sí | Cambiar foto |
| DELETE | /api/testimonials/:id | Sí | Eliminar |

### Solicitudes de Contacto

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/contact-requests/public | No | Enviar solicitud |
| GET | /api/contact-requests | Sí | Listar admin |
| GET | /api/contact-requests/:id | Sí | Obtener por ID |
| PUT | /api/contact-requests/:id | Sí | Actualizar |
| PATCH | /api/contact-requests/:id | Sí | Actualizar parcial |
| PUT | /api/contact-requests/:id/status | Sí | Cambiar estado |
| DELETE | /api/contact-requests/:id | Sí | Eliminar |

### Usuarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/users | Sí (superadmin) | Listar |
| POST | /api/users | Sí (superadmin) | Crear |
| PUT | /api/users/:id | Sí | Actualizar |
| PATCH | /api/users/:id | Sí | Actualizar parcial |
| PUT | /api/users/:id/password | Sí (superadmin) | Cambiar contraseña |
| DELETE | /api/users/:id | Sí (superadmin) | Desactivar |
| DELETE | /api/users/:id/permanent | Sí (superadmin) | Eliminar permanentemente |

### Archivos

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/archivos | Sí | Listar archivos |
| GET | /api/archivos/:id | Sí | Obtener |
| POST | /api/archivos | Sí | Registrar URL |
| POST | /api/archivos/upload | Sí | Subir archivo |
| PUT | /api/archivos/:id | Sí | Actualizar |
| PATCH | /api/archivos/:id | Sí | Actualizar parcial |
| DELETE | /api/archivos/:id | Sí | Eliminar |

### Auditoría

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/auditoria | Sí | Listar eventos (superadmin/admin_pais) |
| GET | /api/auditoria/:id | Sí | Obtener evento |

### Conexiones

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/connection-logs | Sí | Listar historial |
| GET | /api/connection-logs/summary | Sí | Resumen (totales, últimas) |
| GET | /api/connection-logs/:id | Sí | Obtener registro |

### Categorías

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/categorias | Sí | Listar |
| GET | /api/categorias/:id | Sí | Obtener |
| POST | /api/categorias | Sí | Crear |
| PUT | /api/categorias/:id | Sí | Actualizar |
| PATCH | /api/categorias/:id | Sí | Actualizar parcial |
| DELETE | /api/categorias/:id | Sí | Eliminar |

### Estadísticas por País

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/estadisticas-pais | Sí | Listar (filtro por ?pais_id=) |
| GET | /api/estadisticas-pais/:id | Sí | Obtener |
| POST | /api/estadisticas-pais | Sí | Crear |
| PUT | /api/estadisticas-pais/:id | Sí | Actualizar |
| PATCH | /api/estadisticas-pais/:id | Sí | Actualizar parcial |
| DELETE | /api/estadisticas-pais/:id | Sí | Eliminar |

### Notificaciones

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/notificaciones | Sí | Listar mis notificaciones |
| GET | /api/notificaciones/contar | Sí | Contar no leídas |
| PATCH | /api/notificaciones/leer-todas | Sí | Marcar todas leídas |
| PATCH | /api/notificaciones/:id/leer | Sí | Marcar una leída |

### Historial de Noticias (versionado automático)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/historial-noticias/noticia/:noticiaId | Sí | Versiones de una noticia |
| GET | /api/historial-noticias/:id | Sí | Obtener versión |

### Comentarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/comentarios/public/:noticiaId | No | Comentarios públicos (aprobados) |
| POST | /api/comentarios/public | No | Enviar comentario (queda pendiente) |
| GET | /api/comentarios | Sí | Listar admin (con filtros) |
| GET | /api/comentarios/:id | Sí | Obtener |
| PATCH | /api/comentarios/:id/moderar | Sí | Aprobar/rechazar |
| DELETE | /api/comentarios/:id | Sí | Eliminar |

### Rutas con nombres en español (alias)

Todas las rutas anteriores también están disponibles con nombres en español:

| Ruta | Alias |
|------|-------|
| /api/countries | /api/paises |
| /api/news | /api/noticias |
| /api/testimonials | /api/testimonios |
| /api/contact-requests | /api/solicitudes |
| /api/users | /api/usuarios |

### Rutas públicas con nombres en español

| Ruta | Descripción |
|------|-------------|
| GET /api/public/paises/:slug/noticias | Noticias públicas |
| GET /api/public/paises/:slug/noticias/:slug | Detalle de noticia |
| GET /api/public/paises/:slug/testimonios | Testimonios públicos |
| POST /api/public/paises/:slug/solicitudes | Enviar solicitud |

---

## Seguridad

- **Rate limiting**: POST /api/auth/login limitado a 10 intentos cada 15 minutos
- **Token rotation**: Cada uso de refreshToken invalida el anterior y genera uno nuevo
- **Documentación Swagger**: Disponible en `/api/docs` con especificación OpenAPI 3.0 de todos los endpoints
- **Filtro por país**: Los usuarios `admin_pais` solo ven datos de su propio país (noticias, testimonios, usuarios, auditoría, conexiones, comentarios, archivos, solicitudes)
- **RBAC**: Control de acceso basado en roles (`superadmin`, `admin_pais`, `editor`) con middleware `authorizeRoles`

## Tests

```bash
cd backend
npm test           # 47 tests (23 unit + 17 integration + 7 refresh token rotation)
npm run test:unit  # solo unitarios
```

## Despliegue con Docker (ARM64)

```bash
docker compose up -d --build
```

