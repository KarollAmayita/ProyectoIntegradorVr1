# CMS Multipais

API REST para sistema de gestión de contenidos multi-país desarrollado con Express y Supabase.

## Descripción

Backend administrativo para un CMS multi-país que permite gestionar contenidos (noticias, testimonios, solicitudes de contacto) por país, con autenticación JWT, refresh tokens y control de acceso basado en roles (RBAC).

## Características

- Autenticación con JWT (Access Token + Refresh Token)
- Control de acceso basado en roles (RBAC)
- Gestión de usuarios (superadmin, admin_pais, editor)
- Superadmin puede tener acceso global (pais_id = NULL)
- Refresh token para renovación de sesión
- Logout y logout-all (invalidación de refresh tokens)
- Módulo de países
- Módulo de noticias
- Módulo de testimonios
- Módulo de solicitudes de contacto
- API pública para noticias y testimonios
- Frontend de prueba incluido (diseño con Bootstrap 5)

## Roles

| Rol | Descripción |
|-----|-----------|
| superadmin | Administrador general del sistema |
| admin_pais | Administrador de un país específico |
| editor | Usuario editor de contenidos |

## Tecnologías

- Node.js + Express
- Supabase (PostgreSQL)
- JWT (jsonwebtoken)
- bcryptjs
- Bootstrap 5 (Frontend)
- Vanilla JavaScript

## Estructura del Proyecto

```
ProyectoIntegradorVr1/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuración (Supabase)
│   │   ├── controllers/   # Controladores
│   │   ├── services/     # Lógica de negocio
│   │   ├── repositories/ # Acceso a datos
│   │   ├── routes/      # Rutas API
│   │   ├── middlewares/  # Autenticación, roles y errores
│   │   ├── utils/       # Utilidades (errores personalizados)
│   │   ├── scripts/     # Scripts utilitarios
│   │   └── db/          # Esquema de base de datos
│   ├── package.json
│   └── .env
└── frontend/
    ├── assets/
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── auth.js
    └── pages/
        ├── login.html
        ├── register.html
        └── dashboard.html
```

## Instalación

```bash
cd backend
npm install
```

## Configuración

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=3001
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
JWT_SECRET=tu_clave_secreta
```

## Base de Datos

Ejecutar el script SQL en el SQL Editor de Supabase:

```bash
# El archivo está en:
backend/src/db/cms-multipais.sql
```

Este script crea:
- Tablas: paises, roles, usuarios, noticias, testimonios, solicitudes_contacto, refresh_tokens
- Datos iniciales: 3 países (Colombia, Chile, Ecuador) y 3 roles

## Scripts Utilitarios

```bash
# Crear países (si no existen)
node backend/src/scripts/createCountries.js

# Crear superadmin (usuario: superadmin, pass: 123456)
node backend/src/scripts/createSuperAdmin.js

# Crear usuario editor de prueba
node backend/src/scripts/createTestUser.js
```

## Ejecución

```bash
cd backend
npm run dev
```

El servidor corre en `http://localhost:3001`

## Frontend

Abre `frontend/pages/login.html` en tu navegador para probar:
- Diseño con Bootstrap 5 y paleta de colores muted coral/peach
- Login, Registro, Dashboard con sidebar
- Navegación dinámica sin recargar página

Credenciales de prueba:
- **Superadmin**: usuario `superadmin`, password `123456`
- **Editor**: usuario `testeditor`, password `editor123`

## Endpoints

### Autenticación

| Método | Ruta | Descripción | Protegido |
|--------|------|------------|-----------|
| POST | /api/auth/login | Iniciar sesión | No |
| POST | /api/auth/register | Registrar usuario | No |
| POST | /api/auth/refresh-token | Renovar access token | No |
| POST | /api/auth/logout | Cerrar sesión actual | Sí |
| POST | /api/auth/logout-all | Cerrar todas las sesiones | Sí |

### Perfil

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | /api/profile/me | Obtener perfil |

### Países

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | /api/countries | Listar países |
| GET | /api/countries/active | Países activos |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | /api/users | Listar usuarios |
| POST | /api/users | Crear usuario |
| PUT | /api/users/:id | Actualizar usuario |
| DELETE | /api/users/:id | Eliminar usuario |

### Noticias

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | /api/news | Listar noticias |
| POST | /api/news | Crear noticia |
| PUT | /api/news/:id | Actualizar noticia |
| DELETE | /api/news/:id | Eliminar noticia |
| GET | /api/news/public/:slug | Noticias publicadas |

### Testimonios

| Método | Ruta | Descripción |
|--------|------|------------|
| GET | /api/testimonials | Listar testimonios |
| POST | /api/testimonials | Crear testimonio |
| PUT | /api/testimonials/:id | Actualizar testimonio |
| DELETE | /api/testimonials/:id | Eliminar testimonio |
| GET | /api/testimonials/public/:slug | Testimonios públicos |

### Solicitudes de Contacto

| Método | Ruta | Descripción |
|--------|------|------------|
| POST | /api/contact-requests/public | Crear solicitud |
| GET | /api/contact-requests | Listar solicitudes |
| PUT | /api/contact-requests/:id/status | Actualizar estado |
| DELETE | /api/contact-requests/:id | Eliminar solicitud |

## Diseño Frontend

- **Paleta de colores**: Muted Coral/Peach (#C75F5A, #E8877A, #F5C9A6, #FCE8BE)
- **Framework**: Bootstrap 5 (CDN)
- **Tipografía**: Poppins (Google Fonts)
- **Iconos**: Bootstrap Icons
- **Layout**: Dashboard con sidebar fijo y contenido dinámico

## Licencia

ISC
