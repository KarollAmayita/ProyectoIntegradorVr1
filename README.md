# CMS Multipais - Backend

API REST para sistema de gestión de contenidos multi-país desarrollado con Express y Supabase.

## Descripción

Backend administrativo para un CMS multi-país que permite gestionar contenidos (noticias, testimonios, solicitudes de contacto) por país, con autenticación JWT y control de acceso basado en roles (RBAC).

## Características

- Autenticación con JWT
- Control de acceso basado en roles (RBAC)
- Gestión de usuarios (superadmin, admin_pais, editor)
- Módulo de países
- Módulo de noticias
- Módulo de testimonios
- Módulo de solicitudes de contacto
- API pública para noticias y testimonios

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

## Estructura

```
src/
├── config/        # Configuración (Supabase)
├── controllers/   # Controladores
├── services/     # Lógica de negocio
├── repositories/ # Acceso a datos
├── routes/      # Rutas API
├── middlewares/  # Autenticación y roles
└── scripts/    # Scripts utilitarios
```

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env`:

```env
PORT=3001
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
JWT_SECRET=tu_clave_secreta
```

## Ejecución

```bash
npm run dev
```

El servidor corre en `http://localhost:3001`

## Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|------------|
| POST | /api/auth/login | Iniciar sesión |

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

## Convenciones de Commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/).

Ver [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md) para más información.

## Licencia

ISC