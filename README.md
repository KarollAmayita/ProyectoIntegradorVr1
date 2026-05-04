# CMS Multipais - Backend

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
- Frontend de prueba incluido

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
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── supabase.js
│   │   ├── controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── contactRequestController.js
│   │   │   ├── countryController.js
│   │   │   ├── newsController.js
│   │   │   ├── profileController.js
│   │   │   ├── testimonialController.js
│   │   │   └── userController.js
│   │   ├── db
│   │   │   └── cms-multipais.sql
│   │   ├── middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── repositories
│   │   │   ├── authRepository.js
│   │   │   ├── contactRequestRepository.js
│   │   │   ├── countryRepository.js
│   │   │   ├── newsRepository.js
│   │   │   ├── rolRepository.js
│   │   │   ├── testimonialRepository.js
│   │   │   └── userRepository.js
│   │   ├── routes
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── contactRequestRoutes.js
│   │   │   ├── countryRoutes.js
│   │   │   ├── newsRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   ├── testimonialRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── scripts
│   │   │   ├── createCountries.js
│   │   │   ├── createRefreshTokensTable.js
│   │   │   ├── createSuperAdmin.js
│   │   │   ├── createTestUser.js
│   │   │   └── setupDatabase.js
│   │   ├── services
│   │   │   ├── authService.js
│   │   │   ├── contactRequestService.js
│   │   │   ├── countryService.js
│   │   │   ├── newsService.js
│   │   │   ├── testimonialService.js
│   │   │   └── userService.js
│   │   ├── utils
│   │   │   └── errors.js
│   │   └── app.js
│   ├── package-lock.json
│   └── package.json
├── frontend
│   ├── assets
│   │   ├── css
│   │   │   └── styles.css
│   │   └── js
│   │       └── auth.js
│   ├── pages
│   │   ├── dashboard.html
│   │   ├── login.html
│   │   └── register.html
│   └── index.html
├── .gitignore
└── README.md

```


### Tabla `paises`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| nombre | text | NOT NULL |
| codigo | text | NOT NULL, UNIQUE |
| slug | text | NOT NULL, UNIQUE |
| estado | text | DEFAULT 'activo' |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### Tabla `roles`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| nombre | text | NOT NULL, UNIQUE |
| descripcion | text | - |
| created_at | timestamptz | DEFAULT now() |

### Tabla `usuarios`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| nombre | text | NOT NULL |
| apellido | text | NOT NULL |
| email | text | NOT NULL, UNIQUE |
| username | text | NOT NULL, UNIQUE |
| password_hash | text | NOT NULL |
| rol_id | bigint | FK -> roles(id) |
| pais_id | bigint | FK -> paises(id) |
| estado | text | DEFAULT 'activo' |
| ultimo_acceso | timestamptz | - |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### Tabla `refresh_tokens`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| usuario_id | bigint | FK -> usuarios(id) ON DELETE CASCADE |
| token | text | NOT NULL, UNIQUE |
| expires_at | timestamptz | NOT NULL |
| created_at | timestamptz | DEFAULT now() |

### Tabla `noticias`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| pais_id | bigint | FK -> paises(id) ON DELETE CASCADE |
| titulo | text | NOT NULL |
| slug | text | NOT NULL |
| resumen | text | NOT NULL |
| contenido | text | NOT NULL |
| imagen_principal_url | text | - |
| autor_id | bigint | FK -> usuarios(id) |
| estado | text | DEFAULT 'borrador', CHECK (borrador/publicado/despublicado) |
| fecha_publicacion | timestamptz | - |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |
| UNIQUE (pais_id, slug) | - | - |

### Tabla `testimonios`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| pais_id | bigint | FK -> paises(id) ON DELETE CASCADE |
| nombre | text | NOT NULL |
| cargo | text | - |
| empresa | text | - |
| contenido | text | NOT NULL |
| foto_url | text | NOT NULL |
| instagram_url | text | - |
| facebook_url | text | - |
| estado | text | DEFAULT 'borrador', CHECK (borrador/publicado/despublicado) |
| destacado | boolean | DEFAULT false |
| autor_id | bigint | FK -> usuarios(id) |
| fecha_publicacion | timestamptz | - |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |

### Tabla `solicitudes_contacto`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | bigint | PK, identity |
| pais_id | bigint | FK -> paises(id) ON DELETE CASCADE |
| nombre | text | NOT NULL |
| correo | text | NOT NULL |
| telefono | text | NOT NULL |
| finalidad | text | NOT NULL, CHECK (Servicio/Programa EDIFICA/Shows y conferencias) |
| mensaje | text | - |
| estado | text | DEFAULT 'pendiente', CHECK (pendiente/en_proceso/gestionada/cerrada) |
| observaciones_admin | text | - |
| fecha_gestion | timestamptz | - |
| gestionado_por | bigint | FK -> usuarios(id) |
| created_at | timestamptz | DEFAULT now() |
| updated_at | timestamptz | DEFAULT now() |


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

## Base de Datos

Ejecutar el script SQL en el SQL Editor de Supabase:

```bash
# El archivo está en:
src/db/cms-multipais.sql
```

Este script crea:
- Tablas: paises, roles, usuarios, noticias, testimonios, solicitudes_contacto, refresh_tokens
- Datos iniciales: 3 países (Colombia, Chile, Ecuador) y 3 roles

## Scripts Utilitarios

```bash
# Crear países (si no existen)
node src/scripts/createCountries.js

# Crear superadmin (usuario: superadmin, pass: 123456)
node src/scripts/createSuperAdmin.js

# Crear usuario editor de prueba
node src/scripts/createTestUser.js
```

## Ejecución

```bash
npm run dev
```

El servidor corre en `http://localhost:3001`

## Frontend de Prueba

Abre `frontend/index.html` en tu navegador para probar:
- Login
- Registro
- Refresh token
- Logout

Credenciales de prueba:
- **Superadmin**: usuario `superadmin`, password `123456`
- **Editor**: usuario `testeditor`, password `123456`

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



## Licencia

ISC
