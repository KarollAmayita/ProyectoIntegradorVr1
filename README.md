# CMS Multipaís

API REST + Frontend para sistema de gestión de contenidos multi-país desarrollado con Express y Supabase.

## Descripción

Sistema CMS multi-país que permite gestionar contenidos (noticias, testimonios, solicitudes de contacto) por país, con autenticación JWT, refresh tokens, control de acceso basado en roles (RBAC) y portal público por país.

### Países disponibles

| País | Código | Slug |
|------|--------|------|
| Chile | CL | chile |
| Argentina | AR | argentina |
| Ecuador | EC | ecuador |

## Características

- Autenticación con JWT (Access Token + Refresh Token)
- Control de acceso basado en roles (RBAC)
- Gestión de usuarios (superadmin, admin_pais, editor)
- Superadmin con acceso global (pais_id = NULL)
- CRUD completo de noticias, testimonios, solicitudes y usuarios
- API pública para noticias y testimonios
- Portal público por país (Argentina) con testimonios, noticias y formulario de testimonios
- Búsqueda en tiempo real en el portal público
- Panel administrativo completo con sidebar dinámica según rol
- Despliegue con Docker (compatible ARM64)

## Roles

| Rol | Descripción |
|-----|-----------|
| superadmin | Administrador general del sistema |
| admin_pais | Administrador de un país específico |
| editor | Usuario editor de contenidos |

## Tecnologías

- Node.js + Express 5
- Supabase (PostgreSQL)
- JWT (jsonwebtoken)
- bcryptjs
- Docker + docker-compose

## Estructura

```
├── backend
│   ├── src
│   │   ├── config/supabase.js
│   │   ├── controllers/
│   │   ├── db/cms-multipais.sql
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── utils/errors.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── ...
├── frontend
│   ├── assets/
│   ├── pages
│   │   ├── admin/ (login, dashboard, noticias, testimonios, solicitudes, usuarios)
│   │   └── portales/argentina/ (portal público)
│   └── index.html
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── README.md
```

## Instalación y ejecución local

### 1. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales de Supabase
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Base de datos

Ejecutar el script `backend/src/db/cms-multipais.sql` en el SQL Editor de Supabase para crear tablas y datos iniciales (3 países y 3 roles).

### 4. Ejecutar

```bash
cd backend
npm run dev
```

Servidor en `http://localhost:3001`

### 5. Scripts utilitarios

```bash
cd backend
node src/scripts/createCountries.js   # Crear países
node src/scripts/createSuperAdmin.js  # Crear superadmin (superadmin / 123456)
node src/scripts/createTestUser.js    # Crear editor de prueba
```

## Despliegue con Docker (ARM64)

```bash
# Construir y levantar
docker compose up -d --build

# O manualmente
docker build -t cms-multipais .
docker run -d --restart unless-stopped -p 3001:3001 --env-file backend/.env cms-multipais
```

## Acceso

### Portal público
`http://localhost:3001` — redirige al portal de Argentina

### Panel administrativo
`http://localhost:3001/pages/admin/login.html`

### Usuarios predefinidos

| Usuario | Password | Rol | País |
|---------|----------|-----|------|
| superadmin | 123456 | superadmin | Global |
| adminarg | admin123 | admin_pais | Argentina |
| sistema | sistema123 | editor | Argentina (usuario interno) |

## Endpoints de la API

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| POST | /api/auth/login | Iniciar sesión | No |
| POST | /api/auth/register | Registrar usuario | No |
| POST | /api/auth/refresh-token | Renovar access token | No |
| POST | /api/auth/logout | Cerrar sesión | Sí |
| POST | /api/auth/logout-all | Cerrar todas las sesiones | Sí |

### Países

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| GET | /api/countries | Listar países | Sí (superadmin) |
| GET | /api/countries/active | Países activos | No |

### Noticias

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| GET | /api/news/public/:countrySlug | Noticias publicadas | No |
| GET | /api/news | Listar todas | Sí |
| POST | /api/news | Crear | Sí |
| PUT | /api/news/:id | Actualizar | Sí |
| DELETE | /api/news/:id | Eliminar | Sí |

### Testimonios

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| GET | /api/testimonials/public/:countrySlug | Testimonios publicados | No |
| POST | /api/testimonials/public | Enviar testimonio (público) | No |
| GET | /api/testimonials | Listar todos | Sí |
| POST | /api/testimonials | Crear | Sí |
| PUT | /api/testimonials/:id | Actualizar | Sí |
| DELETE | /api/testimonials/:id | Eliminar | Sí |

### Solicitudes de Contacto

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| POST | /api/contact-requests/public | Crear solicitud | No |
| GET | /api/contact-requests | Listar | Sí |
| PUT | /api/contact-requests/:id/status | Actualizar estado | Sí |
| DELETE | /api/contact-requests/:id | Eliminar | Sí |

### Usuarios

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| GET | /api/users | Listar usuarios | Sí (superadmin) |
| POST | /api/users | Crear usuario | Sí (superadmin) |
| PUT | /api/users/:id/password | Cambiar contraseña | Sí (superadmin) |

### Perfil

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | /api/profile/me | Obtener perfil |
