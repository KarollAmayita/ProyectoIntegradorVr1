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
│   │   ├── controllers/      → auth, profile, admin, user, country, news, testimonial, contactRequest
│   │   ├── db/               → cms-multipais.sql
│   │   ├── middlewares/      → auth, role, errorHandler, validation
│   │   ├── repositories/     → capa de datos
│   │   ├── routes/           → definición de rutas
│   │   ├── scripts/          → createSuperAdmin.js
│   │   ├── services/         → lógica de negocio
│   │   ├── utils/errors.js
│   │   └── app.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── admin/                → login, recuperar, dashboard, noticias, testimonios, solicitudes, usuarios
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

### Rutas públicas

| Ruta | Descripción |
|------|------------|
| `/` | Landing page multi-país |
| `/argentina` | Portal público de Argentina |

### Usuarios predefinidos

| Usuario | Password | Rol | País |
|---------|----------|-----|------|
| superadmin | 123456 | superadmin | Global |
| admin_arg | 123456 | admin_pais | Argentina |
| adminarg | admin123 | admin_pais | Argentina |
| sistema | sistema123 | editor | Argentina |

---

## Endpoints de la API

### Autenticación

| Método | Ruta | Auth |
|--------|------|------|
| POST | /api/auth/login | No |
| POST | /api/auth/register | No |
| POST | /api/auth/refresh-token | No |
| POST | /api/auth/logout | Sí |
| POST | /api/auth/logout-all | Sí |
| POST | /api/auth/forgot-password | No |
| POST | /api/auth/reset-password | No |
| PUT | /api/auth/change-password | Sí |
| PATCH | /api/auth/security-question | Sí |

### Países

| Método | Ruta | Auth |
|--------|------|------|
| GET | /api/countries | Sí (superadmin) |
| GET | /api/countries/active | No |

### Noticias

| Método | Ruta | Auth |
|--------|------|------|
| GET | /api/news/public/:countrySlug | No |
| GET | /api/news/public/:countrySlug/:slug | No |
| GET | /api/news | Sí |
| POST | /api/news | Sí |
| PUT | /api/news/:id | Sí |
| DELETE | /api/news/:id | Sí |

### Testimonios

| Método | Ruta | Auth |
|--------|------|------|
| GET | /api/testimonials/public/:countrySlug | No |
| POST | /api/testimonials/public | No |
| GET | /api/testimonials | Sí |
| POST | /api/testimonials | Sí |
| PUT | /api/testimonials/:id | Sí |
| DELETE | /api/testimonials/:id | Sí |

### Solicitudes de Contacto

| Método | Ruta | Auth |
|--------|------|------|
| POST | /api/contact-requests/public | No |
| GET | /api/contact-requests | Sí |
| PUT | /api/contact-requests/:id/status | Sí |
| DELETE | /api/contact-requests/:id | Sí |

### Usuarios

| Método | Ruta | Auth |
|--------|------|------|
| GET | /api/users | Sí (superadmin) |
| POST | /api/users | Sí (superadmin) |
| PUT | /api/users/:id/password | Sí (superadmin) |

### Perfil

| Método | Ruta |
|--------|------|
| GET | /api/profile/me |

---

## Despliegue con Docker (ARM64)

```bash
docker compose up -d --build
```

