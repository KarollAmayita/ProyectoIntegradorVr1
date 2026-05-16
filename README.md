# CMS Multipaís

API REST + Frontend para sistema de gestión de contenidos multi-país desarrollado con Express y Supabase.

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
- JWT (jsonwebtoken)
- bcryptjs
- Docker + docker-compose

## Estructura del proyecto

```
├── backend/
│   ├── src/
│   │   ├── config/           → supabase.js
│   │   ├── controllers/      → auth, profile, admin, user, country, news, testimonial, contactRequest, connectionLog, archivos, auditoria, categoria, estadisticaPais, notificacion, historialNoticia, comentario
│   │   ├── db/               → cms-multipais.sql
│   │   ├── middlewares/      → auth, role, errorHandler, validation
│   │   ├── repositories/     → capa de datos (14 repositorios)
│   │   ├── routes/           → definición de rutas (14 archivos)
│   │   ├── scripts/          → createSuperAdmin.js
│   │   ├── services/         → lógica de negocio (14 servicios)
│   │   ├── utils/errors.js, versionador.js
│   │   └── app.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── admin/                → login, recuperar, dashboard, noticias, testimonios, solicitudes, usuarios, conexiones
│   │   ├── admin-styles.css
│   │   ├── admin-shared.js
│   │   └── *.html
│   ├── portales/
│   │   ├── argentina/        → portal público (index.html, styles.css, main.js)
│   │   └── indice/           → landing page multi-país (index.html, styles.css, main.js)
│   └── assets/
│       └── img/
│           ├── argentina/
│           └── portales/
├── Dockerfile
├── docker-compose.yml
└── README.md
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
node src/scripts/createSuperAdmin.js
```

Servidor en `http://localhost:3001`

---

## Desarrollo por partes

### Parte 1: Instalaciones

```bash
mkdir cms-multipais && cd cms-multipais && mkdir backend && cd backend
npm init -y
npm install express cors dotenv @supabase/supabase-js bcryptjs jsonwebtoken
npm install nodemon -D
```

### Parte 2: package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/app.js",
  "scripts": { "dev": "nodemon src/app.js" },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.4",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": { "nodemon": "^3.1.10" }
}
```

### Parte 3: Estructura inicial del backend

```
backend/src/
├── config/supabase.js
├── controllers/authController.js
├── services/authService.js
├── repositories/authRepository.js
├── routes/authRoutes.js
├── middlewares/authMiddleware.js
└── app.js
```

### Parte 4: Script SQL — Tablas

```sql
create table paises (
  id bigint generated always as identity primary key,
  nombre text not null, codigo text not null unique,
  slug text not null unique, estado text not null default 'activo',
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table roles (
  id bigint generated always as identity primary key,
  nombre text not null unique, descripcion text,
  created_at timestamptz default now()
);

create table usuarios (
  id bigint generated always as identity primary key,
  nombre text not null, apellido text not null,
  email text not null unique, username text not null unique,
  password_hash text not null,
  pregunta_seguridad text,
  respuesta_seguridad_hash text,
  password_updated_at timestamptz,
  rol_id bigint not null references roles(id),
  pais_id bigint references paises(id),
  estado text not null default 'activo',
  ultimo_acceso timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

> **Partes 14-16**: Agregar tablas `noticias`, `testimonios`, `solicitudes_contacto` (ver SQL completo en `backend/src/db/cms-multipais.sql`)

### Parte 5: Datos iniciales

```sql
insert into paises (nombre, codigo, slug) values
('Colombia', 'CO', 'colombia'),
('Chile', 'CL', 'chile'),
('Ecuador', 'EC', 'ecuador');

insert into roles (nombre, descripcion) values
('superadmin', 'Administrador general del sistema'),
('admin_pais', 'Administrador de un país específico'),
('editor', 'Usuario editor de contenidos');
```

### Parte 6: Variables de entorno

```
PORT=3001
SUPABASE_URL=URL_DE_SUPABASE
SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_KEY
JWT_SECRET=clave_segura_cms_usta_multipais_2026
```

- `SUPABASE_URL`: Project settings → Data API → API URL
- `SUPABASE_SERVICE_ROLE_KEY`: Project settings → API keys → service_role secret

### Parte 7: Archivos del proyecto

```
src/config/supabase.js
src/repositories/authRepository.js
src/services/authService.js
src/controllers/authController.js
src/routes/authRoutes.js
src/middlewares/authMiddleware.js
src/app.js
```

```bash
npm run dev
```

### Parte 8: Script superadmin

```bash
mkdir src/scripts
# crear src/scripts/createSuperAdmin.js
node src/scripts/createSuperAdmin.js
```

### Parte 9: Probar login

```
POST http://localhost:3001/api/auth/login
```
```json
{ "username": "superadmin", "password": "123456" }
```

### Parte 10: Ruta protegida

Archivos: `profileController.js`, `profileRoutes.js`

```
GET http://localhost:3001/api/profile/me
Authorization: Bearer TOKEN
```

### Parte 11: RBAC

Archivos: `roleMiddleware.js`, `adminController.js`, `adminRoutes.js`

```
GET http://localhost:3001/api/admin/panel
Authorization: Bearer TOKEN
```

### Parte 12: Módulo usuarios

Archivos: `userRepository.js`, `userService.js`, `userController.js`, `userRoutes.js`

```
GET http://localhost:3001/api/users                          (listar)
POST http://localhost:3001/api/users                         (crear)
```
Headers: `Authorization: Bearer TOKEN`

Crear admin de Colombia:
```json
{
  "nombre": "Admin", "apellido": "Colombia",
  "email": "admin.co@cms.com", "username": "admin_colombia",
  "password": "123456", "rol_id": 2, "pais_id": 1,
  "pregunta_seguridad": "¿Cuál es el código inicial del sistema?",
  "respuesta_seguridad": "cms2026"
}
```

### Parte 13: Módulo países

Archivos: `countryRepository.js`, `countryService.js`, `countryController.js`, `countryRoutes.js`

```
GET http://localhost:3001/api/countries           (todos, requiere token)
GET http://localhost:3001/api/countries/active    (solo activos)
```

### Parte 14: Módulo noticias

```sql
create table noticias ( ... ); -- ver cms-multipais.sql
```

Archivos: `newsRepository.js`, `newsService.js`, `newsController.js`, `newsRoutes.js`

```
POST   /api/news                          (crear)
GET    /api/news                          (listar admin)
PUT    /api/news/:id                      (editar)
DELETE /api/news/:id                      (eliminar)
GET    /api/news/public/:countrySlug      (público)
GET    /api/news/public/:countrySlug/:slug (detalle público)
```

### Parte 15: Módulo testimonios

```sql
create table testimonios ( ... ); -- ver cms-multipais.sql
```

Archivos: `testimonialRepository.js`, `testimonialService.js`, `testimonialController.js`, `testimonialRoutes.js`

```
POST   /api/testimonials                          (crear)
GET    /api/testimonials                          (listar admin)
PUT    /api/testimonials/:id                      (editar)
DELETE /api/testimonials/:id                      (eliminar)
GET    /api/testimonials/public/:countrySlug      (público)
```

### Parte 16: Módulo solicitudes de contacto

```sql
create table solicitudes_contacto ( ... ); -- ver cms-multipais.sql
```

Archivos: `contactRequestRepository.js`, `contactRequestService.js`, `contactRequestController.js`, `contactRequestRoutes.js`

```
POST   /api/contact-requests/public               (público, sin token)
GET    /api/contact-requests                       (admin, requiere token)
PUT    /api/contact-requests/:id/status            (admin)
DELETE /api/contact-requests/:id                   (admin)
```

### Parte 17: Recuperación de contraseña

#### Migración SQL

```sql
alter table usuarios
add column if not exists pregunta_seguridad text,
add column if not exists respuesta_seguridad_hash text,
add column if not exists password_updated_at timestamptz;
```

#### Archivos actualizados

```
src/repositories/authRepository.js
src/services/authService.js
src/controllers/authController.js
src/routes/authRoutes.js
src/repositories/userRepository.js
src/services/userService.js
src/controllers/userController.js
src/routes/userRoutes.js
src/scripts/createSuperAdmin.js
```

#### Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| POST | /api/auth/forgot-password | Obtener pregunta de seguridad | No |
| POST | /api/auth/reset-password | Restaurar contraseña | No |
| PUT | /api/auth/change-password | Cambiar contraseña propia | Sí |
| PATCH | /api/auth/security-question | Cambiar pregunta y respuesta | Sí |

#### Probar en Postman

**Olvidé mi contraseña:**
```
POST /api/auth/forgot-password
```
```json
{ "identifier": "superadmin" }
```
Respuesta: `{ "pregunta_seguridad": "¿Cuál es el código inicial del sistema?" }`

**Restaurar contraseña:**
```
POST /api/auth/reset-password
```
```json
{
  "username": "superadmin",
  "respuesta_seguridad": "cms2026",
  "nueva_password": "123456789"
}
```

**Cambiar contraseña propia** (requiere token):
```
PUT /api/auth/change-password
Authorization: Bearer TOKEN
```
```json
{ "password_actual": "123456789", "nueva_password": "123456" }
```

**Superadmin cambia contraseña de otro**:
```
PUT /api/users/2/password
Authorization: Bearer TOKEN_SUPERADMIN
```
```json
{ "nueva_password": "123456" }
```

**Cambiar pregunta de seguridad** (requiere token):
```
PATCH /api/auth/security-question
Authorization: Bearer TOKEN
```
```json
{
  "pregunta_seguridad": "¿Cuál es tu ciudad favorita?",
  "respuesta_seguridad": "Tunja"
}
```

---

## Frontend

### Rutas del panel administrativo

| Ruta | Descripción |
|------|------------|
| `/admin/login` | Inicio de sesión |
| `/admin/recuperar` | Recuperación de contraseña |
| `/admin/dashboard` | Dashboard principal |
| `/admin/noticias` | Gestión de noticias |
| `/admin/testimonios` | Gestión de testimonios |
| `/admin/solicitudes` | Gestión de solicitudes |
| `/admin/usuarios` | Gestión de usuarios (superadmin) |
| `/admin/conexiones` | Historial de conexiones |

### Rutas públicas

| Ruta | Descripción |
|------|------------|
| `/` | Landing page multi-país |
| `/argentina` | Portal público de Argentina |

### Usuarios predefinidos

| Usuario | Password | Rol | País |
|---------|----------|-----|------|
| superadmin | 123456 | superadmin | Global |
| adminarg | 123456 | admin_pais | Argentina |
| admin_arg | 123456 | admin_pais | Argentina |
| sistema | 123456 | editor | Argentina |

---

## Endpoints de la API

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

### Perfil

| Método | Ruta | Auth |
|--------|------|------|
| GET | /api/profile/me | Sí |

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
| /api/profile | /api/perfil |

### Rutas públicas con nombres en español

| Ruta | Descripción |
|------|-------------|
| GET /api/public/paises/:slug/noticias | Noticias públicas |
| GET /api/public/paises/:slug/noticias/:slug | Detalle de noticia |
| GET /api/public/paises/:slug/testimonios | Testimonios públicos |
| POST /api/public/paises/:slug/solicitudes | Enviar solicitud |

---

## Despliegue con Docker (ARM64)

```bash
docker compose up -d --build
```

