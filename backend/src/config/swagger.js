const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CMS Multipaís API',
      version: '1.0.0',
      description: `API REST para sistema de gestión de contenidos multi-país.

## Roles
| Rol | Permisos |
|-----|----------|
| superadmin | Acceso global a todos los países y módulos |
| admin_pais | Administración de su país asignado |
| editor | Creación y edición de contenidos (sin eliminar) |
| (público) | Solo rutas públicas, sin token |

## Autenticación
1. \`POST /api/auth/login\` → obtienes \`token\` y \`refreshToken\`
2. Envía \`Authorization: Bearer <token>\` en rutas protegidas
3. Cuando el token expire, usa \`POST /api/auth/refresh-token\` para renovar
`,
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Desarrollo local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido de /api/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'superadmin' },
            password: { type: 'string', example: '123456' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Inicio de sesión exitoso' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'Super' },
                apellido: { type: 'string', example: 'Admin' },
                email: { type: 'string', example: 'admin@cms.com' },
                username: { type: 'string', example: 'superadmin' },
                rol: { type: 'string', example: 'superadmin' },
                pais: { type: 'object', nullable: true, description: 'País asignado (null para superadmin)' },
              },
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
        RefreshTokenResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Token renovado exitosamente' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'username', 'password', 'rol_id'],
          properties: {
            nombre: { type: 'string', example: 'Nuevo' },
            apellido: { type: 'string', example: 'Usuario' },
            email: { type: 'string', example: 'nuevo@cms.com' },
            username: { type: 'string', example: 'nuevouser' },
            password: { type: 'string', example: '123456' },
            rol_id: { type: 'integer', example: 3, description: '1=superadmin, 2=admin_pais, 3=editor' },
            pais_id: { type: 'integer', example: 1, description: 'Obligatorio si no es superadmin' },
            pregunta_seguridad: { type: 'string', example: '¿Cuál es tu ciudad favorita?' },
            respuesta_seguridad: { type: 'string', example: 'Tunja' },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['password_actual', 'nueva_password'],
          properties: {
            password_actual: { type: 'string', example: '123456' },
            nueva_password: { type: 'string', example: 'nuevapass123' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['identifier'],
          properties: {
            identifier: { type: 'string', example: 'superadmin', description: 'Username o email' },
          },
        },
        ForgotPasswordResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Pregunta de seguridad encontrada' },
            username: { type: 'string', example: 'superadmin' },
            pregunta_seguridad: { type: 'string', example: '¿Cuál es el código inicial del sistema?' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['username', 'respuesta_seguridad', 'nueva_password'],
          properties: {
            username: { type: 'string', example: 'superadmin' },
            respuesta_seguridad: { type: 'string', example: 'cms2026' },
            nueva_password: { type: 'string', example: 'nuevapass123' },
          },
        },
        SecurityQuestionRequest: {
          type: 'object',
          properties: {
            pregunta_seguridad: { type: 'string', example: '¿Cuál es tu ciudad favorita?' },
            respuesta_seguridad: { type: 'string', example: 'Tunja' },
          },
        },
        Country: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Chile' },
            codigo: { type: 'string', example: 'CL' },
            slug: { type: 'string', example: 'chile' },
            estado: { type: 'string', example: 'activo' },
          },
        },
        News: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Noticia de ejemplo' },
            resumen: { type: 'string', example: 'Resumen breve' },
            contenido: { type: 'string', example: 'Contenido completo...' },
            imagen: { type: 'string', example: 'https://ejemplo.com/img.jpg' },
            estado: { type: 'string', enum: ['publicado', 'borrador', 'despublicado'] },
            slug: { type: 'string', example: 'noticia-de-ejemplo' },
            pais_id: { type: 'integer', example: 1 },
            usuario_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        NewsCreateRequest: {
          type: 'object',
          required: ['titulo', 'resumen', 'contenido'],
          properties: {
            titulo: { type: 'string', example: 'Nueva noticia' },
            resumen: { type: 'string', example: 'Resumen de la noticia' },
            contenido: { type: 'string', example: 'Contenido detallado...' },
            imagen: { type: 'string', example: 'https://ejemplo.com/img.jpg' },
            estado: { type: 'string', enum: ['borrador', 'publicado'], example: 'borrador' },
            pais_id: { type: 'integer', example: 1, description: 'Obligatorio para admin_pais/editor, opcional para superadmin' },
            categorias: { type: 'array', items: { type: 'integer' }, example: [1, 2], description: 'IDs de categorías' },
          },
        },
        NewsStatusRequest: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: { type: 'string', enum: ['publicado', 'borrador', 'despublicado'], example: 'publicado' },
          },
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan Pérez' },
            cargo: { type: 'string', example: 'Director' },
            testimonio: { type: 'string', example: 'Excelente servicio...' },
            foto: { type: 'string', example: 'https://ejemplo.com/foto.jpg' },
            estado: { type: 'string', enum: ['pendiente', 'aprobado', 'rechazado'] },
            pais_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        TestimonialCreateRequest: {
          type: 'object',
          required: ['nombre', 'testimonio'],
          properties: {
            nombre: { type: 'string', example: 'Juan Pérez' },
            cargo: { type: 'string', example: 'Director Ejecutivo' },
            testimonio: { type: 'string', example: 'Excelente plataforma...' },
            foto: { type: 'string', example: 'https://ejemplo.com/foto.jpg' },
            pais_id: { type: 'integer', example: 1 },
          },
        },
        TestimonialStatusRequest: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: { type: 'string', enum: ['aprobado', 'rechazado', 'pendiente'], example: 'aprobado' },
          },
        },
        ContactRequest: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Carlos López' },
            correo: { type: 'string', example: 'carlos@ejemplo.com' },
            telefono: { type: 'string', example: '+56912345678' },
            finalidad: { type: 'string', example: 'Información general' },
            mensaje: { type: 'string', example: 'Quisiera más información...' },
            estado: { type: 'string', enum: ['pendiente', 'respondido', 'cerrado'] },
            pais_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ContactRequestCreateRequest: {
          type: 'object',
          required: ['nombre', 'correo', 'finalidad', 'mensaje'],
          properties: {
            nombre: { type: 'string', example: 'Carlos López' },
            correo: { type: 'string', example: 'carlos@ejemplo.com' },
            telefono: { type: 'string', example: '+56912345678' },
            finalidad: { type: 'string', example: 'Información general' },
            mensaje: { type: 'string', example: 'Quisiera más información...' },
            pais_id: { type: 'integer', example: 1 },
          },
        },
        ContactRequestStatusRequest: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: { type: 'string', enum: ['respondido', 'cerrado'], example: 'respondido' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Super' },
            apellido: { type: 'string', example: 'Admin' },
            email: { type: 'string', example: 'admin@cms.com' },
            username: { type: 'string', example: 'superadmin' },
            estado: { type: 'string', example: 'activo' },
            rol: { type: 'string', example: 'superadmin' },
            pais: { type: 'object', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        UserCreateRequest: {
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'username', 'password', 'rol_id'],
          properties: {
            nombre: { type: 'string', example: 'Nuevo' },
            apellido: { type: 'string', example: 'Usuario' },
            email: { type: 'string', example: 'nuevo@cms.com' },
            username: { type: 'string', example: 'nuevouser' },
            password: { type: 'string', example: '123456' },
            rol_id: { type: 'integer', example: 3 },
            pais_id: { type: 'integer', example: 1, nullable: true },
            pregunta_seguridad: { type: 'string', example: '¿Ciudad favorita?' },
            respuesta_seguridad: { type: 'string', example: 'Tunja' },
          },
        },
        Archivo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'documento.pdf' },
            url: { type: 'string', example: 'https://ejemplo.com/doc.pdf' },
            tipo: { type: 'string', example: 'pdf' },
            noticia_id: { type: 'integer', nullable: true },
            testimonio_id: { type: 'integer', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Auditoria: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuario_id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'superadmin' },
            accion: { type: 'string', example: 'Crear noticia' },
            modulo: { type: 'string', example: 'noticias' },
            ip_address: { type: 'string', example: '192.168.1.1' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ConnectionLog: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuario_id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'superadmin' },
            ip_address: { type: 'string', example: '192.168.1.1' },
            lugar: { type: 'string', example: 'Santiago, Chile', nullable: true },
            user_agent: { type: 'string', example: 'Mozilla/5.0...' },
            created_at: { type: 'string', format: 'date-time', description: 'Hora de inicio de sesión' },
            logout_at: { type: 'string', format: 'date-time', nullable: true, description: 'Hora de cierre de sesión' },
          },
        },
        ConnectionLogSummary: {
          type: 'object',
          properties: {
            total: { type: 'integer', example: 150 },
            total_hoy: { type: 'integer', example: 12 },
            ultimas: { type: 'array', items: { $ref: '#/components/schemas/ConnectionLog' } },
          },
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Deportes' },
            slug: { type: 'string', example: 'deportes' },
            descripcion: { type: 'string', example: 'Noticias deportivas' },
          },
        },
        CategoriaCreateRequest: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Tecnología' },
            descripcion: { type: 'string', example: 'Noticias de tecnología' },
          },
        },
        EstadisticaPais: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            pais_id: { type: 'integer', example: 1 },
            indicador: { type: 'string', example: 'poblacion' },
            valor: { type: 'string', example: '19000000' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Notificacion: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuario_id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Nueva noticia' },
            mensaje: { type: 'string', example: 'Se ha creado una nueva noticia...' },
            leida: { type: 'boolean', example: false },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Comentario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            noticia_id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ana García' },
            correo: { type: 'string', example: 'ana@ejemplo.com' },
            contenido: { type: 'string', example: 'Excelente artículo...' },
            estado: { type: 'string', enum: ['pendiente', 'aprobado', 'rechazado'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ComentarioCreateRequest: {
          type: 'object',
          required: ['noticia_id', 'nombre', 'contenido'],
          properties: {
            noticia_id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ana García' },
            correo: { type: 'string', example: 'ana@ejemplo.com' },
            contenido: { type: 'string', example: 'Excelente artículo...' },
          },
        },
        ComentarioModerarRequest: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: { type: 'string', enum: ['aprobado', 'rechazado'], example: 'aprobado' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Autenticación', description: 'Login, registro, refresh token, recuperación de contraseña' },
      { name: 'Perfil', description: 'Perfil del usuario autenticado' },
      { name: 'Admin', description: 'Panel de administración (superadmin)' },
      { name: 'Usuarios', description: 'Gestión de usuarios (superadmin)' },
      { name: 'Países', description: 'Gestión de países' },
      { name: 'Noticias', description: 'CRUD de noticias' },
      { name: 'Testimonios', description: 'CRUD de testimonios' },
      { name: 'Solicitudes de Contacto', description: 'Gestión de solicitudes de contacto' },
      { name: 'Conexiones', description: 'Historial de inicios y cierres de sesión' },
      { name: 'Archivos', description: 'Gestión de archivos' },
      { name: 'Auditoría', description: 'Bitácora de acciones administrativas' },
      { name: 'Categorías', description: 'Gestión de categorías' },
      { name: 'Estadísticas por País', description: 'Indicadores por país' },
      { name: 'Notificaciones', description: 'Notificaciones por usuario' },
      { name: 'Historial de Noticias', description: 'Versionado automático de noticias' },
      { name: 'Comentarios', description: 'Comentarios públicos con moderación' },
      { name: 'Público (español)', description: 'Rutas públicas con nombres en español' },
    ],
    paths: {
      // ─── A U T H ─────────────────────────────────────────────
      '/api/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión',
          description: 'Autentica usuario con username y password. Rate-limited (10 intentos / 15 min).',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
          responses: {
            200: { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
            400: { description: 'Credenciales faltantes', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Credenciales inválidas o usuario inactivo', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            429: { description: 'Demasiados intentos. Espera 15 minutos.' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Autenticación'],
          summary: 'Registrar usuario',
          description: 'Crea un nuevo usuario (público, pero requiere datos completos).',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
          responses: {
            201: { description: 'Usuario registrado' },
            400: { description: 'Datos incompletos o inválidos' },
            409: { description: 'Email duplicado' },
          },
        },
      },
      '/api/auth/refresh-token': {
        post: {
          tags: ['Autenticación'],
          summary: 'Renovar tokens',
          description: 'Canjea un refresh token por uno nuevo (token rotation: el viejo se invalida).',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } } } },
          responses: {
            200: { description: 'Tokens renovados', content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenResponse' } } } },
            401: { description: 'Refresh token inválido o expirado' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Autenticación'],
          summary: 'Cerrar sesión',
          description: 'Invalida el refresh token y registra el cierre en bitácora de conexiones.',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } } } },
          responses: { 200: { description: 'Sesión cerrada' } },
        },
      },
      '/api/auth/logout-all': {
        post: {
          tags: ['Autenticación'],
          summary: 'Cerrar todas las sesiones',
          description: 'Invalida todos los refresh tokens del usuario autenticado.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Todas las sesiones cerradas' } },
        },
      },
      '/api/auth/session-end': {
        post: {
          tags: ['Autenticación'],
          summary: 'Cierre automático de sesión',
          description: 'Endpoint diseñado para sendBeacon desde beforeunload. No requiere auth.',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenRequest' } } } },
          responses: { 200: { description: 'Sesión finalizada' } },
        },
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Autenticación'],
          summary: 'Obtener pregunta de seguridad',
          description: 'Devuelve la pregunta de seguridad del usuario para iniciar recuperación.',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } } },
          responses: {
            200: { description: 'Pregunta encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordResponse' } } } },
            404: { description: 'Usuario no encontrado' },
          },
        },
      },
      '/api/auth/security-question': {
        post: {
          tags: ['Autenticación'],
          summary: 'Obtener pregunta de seguridad (público)',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } } },
          responses: { 200: { description: 'Pregunta encontrada' } },
        },
        get: {
          tags: ['Autenticación'],
          summary: 'Ver mi pregunta de seguridad',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Pregunta del usuario autenticado' } },
        },
        patch: {
          tags: ['Autenticación'],
          summary: 'Actualizar pregunta de seguridad',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SecurityQuestionRequest' } } } },
          responses: { 200: { description: 'Pregunta actualizada' } },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Autenticación'],
          summary: 'Restaurar contraseña',
          description: 'Resetea la contraseña respondiendo la pregunta de seguridad.',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } } },
          responses: { 200: { description: 'Contraseña restaurada' } },
        },
      },
      '/api/auth/change-password': {
        put: {
          tags: ['Autenticación'],
          summary: 'Cambiar contraseña',
          description: 'Cambia la contraseña del usuario autenticado.',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } } },
          responses: { 200: { description: 'Contraseña cambiada' } },
        },
      },
      '/api/auth/change-my-password': {
        patch: {
          tags: ['Autenticación'],
          summary: 'Cambiar contraseña (alias)',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } } },
          responses: { 200: { description: 'Contraseña cambiada' } },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Autenticación'],
          summary: 'Ver mi perfil',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Perfil del usuario autenticado' } },
        },
        patch: {
          tags: ['Autenticación'],
          summary: 'Actualizar mi perfil / pregunta de seguridad',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SecurityQuestionRequest' } } } },
          responses: { 200: { description: 'Perfil actualizado' } },
        },
      },

      // ─── P R O F I L E ──────────────────────────────────────
      '/api/profile/me': {
        get: {
          tags: ['Perfil'],
          summary: 'Obtener perfil',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Datos del perfil del usuario autenticado' } },
        },
      },

      // ─── A D M I N ──────────────────────────────────────────
      '/api/admin/panel': {
        get: {
          tags: ['Admin'],
          summary: 'Panel de administración',
          description: 'Solo superadmin.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Acceso confirmado' } },
        },
      },

      // ─── U S E R S ──────────────────────────────────────────
      '/api/users': {
        get: {
          tags: ['Usuarios'],
          summary: 'Listar usuarios',
          description: 'Solo superadmin. Devuelve todos los usuarios.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de usuarios', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } },
        },
        post: {
          tags: ['Usuarios'],
          summary: 'Crear usuario',
          description: 'Solo superadmin.',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCreateRequest' } } } },
          responses: { 201: { description: 'Usuario creado' } },
        },
      },
      '/api/users/{id}': {
        put: {
          tags: ['Usuarios'],
          summary: 'Actualizar usuario',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario actualizado' } },
        },
        patch: {
          tags: ['Usuarios'],
          summary: 'Actualizar usuario parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario actualizado' } },
        },
        delete: {
          tags: ['Usuarios'],
          summary: 'Desactivar usuario (soft delete)',
          description: 'Solo superadmin.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario desactivado' } },
        },
      },
      '/api/users/{id}/permanent': {
        delete: {
          tags: ['Usuarios'],
          summary: 'Eliminar usuario permanentemente',
          description: 'Solo superadmin.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario eliminado' } },
        },
      },
      '/api/users/{id}/password': {
        put: {
          tags: ['Usuarios'],
          summary: 'Cambiar contraseña de otro usuario',
          description: 'Solo superadmin.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Contraseña actualizada' } },
        },
      },

      // ─── C O U N T R I E S ──────────────────────────────────
      '/api/countries': {
        get: {
          tags: ['Países'],
          summary: 'Listar países (admin)',
          description: 'Filtrado por rol: superadmin ve todos, admin_pais ve su país.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de países', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Country' } } } } } },
        },
      },
      '/api/countries/active': {
        get: {
          tags: ['Países'],
          summary: 'Listar países activos (público)',
          security: [],
          responses: { 200: { description: 'Lista de países activos' } },
        },
      },

      // ─── N E W S ────────────────────────────────────────────
      '/api/news': {
        get: {
          tags: ['Noticias'],
          summary: 'Listar noticias (admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de noticias' } },
        },
        post: {
          tags: ['Noticias'],
          summary: 'Crear noticia',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/NewsCreateRequest' } } } },
          responses: { 201: { description: 'Noticia creada' } },
        },
      },
      '/api/news/{id}': {
        get: {
          tags: ['Noticias'],
          summary: 'Obtener noticia por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Noticia encontrada' } },
        },
        put: {
          tags: ['Noticias'],
          summary: 'Actualizar noticia',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Noticia actualizada' } },
        },
        patch: {
          tags: ['Noticias'],
          summary: 'Actualizar noticia parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Noticia actualizada' } },
        },
        delete: {
          tags: ['Noticias'],
          summary: 'Eliminar noticia',
          description: 'Solo superadmin y admin_pais.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Noticia eliminada' } },
        },
      },
      '/api/news/{id}/estado': {
        patch: {
          tags: ['Noticias'],
          summary: 'Cambiar estado de noticia',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/NewsStatusRequest' } } } },
          responses: { 200: { description: 'Estado actualizado' } },
        },
      },
      '/api/news/{id}/imagen': {
        patch: {
          tags: ['Noticias'],
          summary: 'Cambiar imagen de noticia',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Imagen actualizada' } },
        },
      },
      '/api/news/public/{countrySlug}': {
        get: {
          tags: ['Noticias'],
          summary: 'Noticias públicas por país',
          security: [],
          parameters: [{ name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' }, example: 'chile' }],
          responses: { 200: { description: 'Lista de noticias publicadas' } },
        },
      },
      '/api/news/public/{countrySlug}/{newsSlug}': {
        get: {
          tags: ['Noticias'],
          summary: 'Detalle público de noticia',
          security: [],
          parameters: [
            { name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'newsSlug', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Detalle de noticia' } },
        },
      },

      // ─── T E S T I M O N I A L S ────────────────────────────
      '/api/testimonials': {
        get: {
          tags: ['Testimonios'],
          summary: 'Listar testimonios (admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de testimonios' } },
        },
        post: {
          tags: ['Testimonios'],
          summary: 'Crear testimonio (admin)',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TestimonialCreateRequest' } } } },
          responses: { 201: { description: 'Testimonio creado' } },
        },
      },
      '/api/testimonials/public': {
        post: {
          tags: ['Testimonios'],
          summary: 'Enviar testimonio (público)',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TestimonialCreateRequest' } } } },
          responses: { 201: { description: 'Testimonio enviado (pendiente de moderación)' } },
        },
      },
      '/api/testimonials/public/{countrySlug}': {
        get: {
          tags: ['Testimonios'],
          summary: 'Testimonios públicos por país',
          security: [],
          parameters: [{ name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Lista de testimonios aprobados' } },
        },
      },
      '/api/testimonials/{id}': {
        get: {
          tags: ['Testimonios'],
          summary: 'Obtener testimonio por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Testimonio encontrado' } },
        },
        put: {
          tags: ['Testimonios'],
          summary: 'Actualizar testimonio',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Testimonio actualizado' } },
        },
        patch: {
          tags: ['Testimonios'],
          summary: 'Actualizar testimonio parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Testimonio actualizado' } },
        },
        delete: {
          tags: ['Testimonios'],
          summary: 'Eliminar testimonio',
          description: 'Solo superadmin y admin_pais.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Testimonio eliminado' } },
        },
      },
      '/api/testimonials/{id}/estado': {
        patch: {
          tags: ['Testimonios'],
          summary: 'Moderar testimonio',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/TestimonialStatusRequest' } } } },
          responses: { 200: { description: 'Estado actualizado' } },
        },
      },
      '/api/testimonials/{id}/foto': {
        patch: {
          tags: ['Testimonios'],
          summary: 'Actualizar foto de testimonio',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Foto actualizada' } },
        },
      },

      // ─── C O N T A C T   R E Q U E S T S ────────────────────
      '/api/contact-requests/public': {
        post: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Enviar solicitud de contacto (público)',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactRequestCreateRequest' } } } },
          responses: { 201: { description: 'Solicitud enviada' } },
        },
      },
      '/api/contact-requests': {
        get: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Listar solicitudes (admin)',
          description: 'Filtrado por país del admin.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de solicitudes' } },
        },
      },
      '/api/contact-requests/{id}': {
        get: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Obtener solicitud por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Solicitud encontrada' } },
        },
        put: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Actualizar solicitud',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Solicitud actualizada' } },
        },
        patch: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Actualizar solicitud parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Solicitud actualizada' } },
        },
        delete: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Eliminar solicitud',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Solicitud eliminada' } },
        },
      },
      '/api/contact-requests/{id}/status': {
        put: {
          tags: ['Solicitudes de Contacto'],
          summary: 'Cambiar estado de solicitud',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactRequestStatusRequest' } } } },
          responses: { 200: { description: 'Estado actualizado' } },
        },
      },

      // ─── C O N N E C T I O N   L O G S ──────────────────────
      '/api/connection-logs': {
        get: {
          tags: ['Conexiones'],
          summary: 'Listar historial de conexiones',
          description: 'Filtros opcionales: limit, offset, username.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'username', in: 'query', schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          ],
          responses: { 200: { description: 'Lista de conexiones', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/ConnectionLog' } }, total: { type: 'integer' } } } } } } },
        },
      },
      '/api/connection-logs/summary': {
        get: {
          tags: ['Conexiones'],
          summary: 'Resumen de conexiones',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Resumen', content: { 'application/json': { schema: { $ref: '#/components/schemas/ConnectionLogSummary' } } } } },
        },
      },
      '/api/connection-logs/{id}': {
        get: {
          tags: ['Conexiones'],
          summary: 'Obtener registro de conexión por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Registro encontrado' } },
        },
      },

      // ─── A R C H I V O S ────────────────────────────────────
      '/api/archivos': {
        get: {
          tags: ['Archivos'],
          summary: 'Listar archivos',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'tipo', in: 'query', schema: { type: 'string' } },
            { name: 'noticia_id', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'Lista de archivos' } },
        },
        post: {
          tags: ['Archivos'],
          summary: 'Registrar URL de archivo',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Archivo registrado' } },
        },
      },
      '/api/archivos/upload': {
        post: {
          tags: ['Archivos'],
          summary: 'Subir archivo físico',
          description: 'Multipart/form-data con el campo "file".',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Archivo subido' } },
        },
      },
      '/api/archivos/{id}': {
        get: {
          tags: ['Archivos'],
          summary: 'Obtener archivo por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Archivo encontrado' } },
        },
        put: {
          tags: ['Archivos'],
          summary: 'Actualizar archivo',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Archivo actualizado' } },
        },
        patch: {
          tags: ['Archivos'],
          summary: 'Actualizar archivo parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Archivo actualizado' } },
        },
        delete: {
          tags: ['Archivos'],
          summary: 'Eliminar archivo',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Archivo eliminado' } },
        },
      },

      // ─── A U D I T O R Í A ──────────────────────────────────
      '/api/auditoria': {
        get: {
          tags: ['Auditoría'],
          summary: 'Listar bitácora de auditoría',
          description: 'Filtros: limit, offset, modulo, usuario_id.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'modulo', in: 'query', schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          ],
          responses: { 200: { description: 'Lista de eventos de auditoría', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Auditoria' } } } } } },
        },
      },
      '/api/auditoria/{id}': {
        get: {
          tags: ['Auditoría'],
          summary: 'Obtener evento de auditoría por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Evento encontrado' } },
        },
      },

      // ─── C A T E G O R Í A S ────────────────────────────────
      '/api/categorias': {
        get: {
          tags: ['Categorías'],
          summary: 'Listar categorías',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de categorías', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } } } } } },
        },
        post: {
          tags: ['Categorías'],
          summary: 'Crear categoría',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriaCreateRequest' } } } },
          responses: { 201: { description: 'Categoría creada' } },
        },
      },
      '/api/categorias/{id}': {
        get: {
          tags: ['Categorías'],
          summary: 'Obtener categoría por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Categoría encontrada' } },
        },
        put: {
          tags: ['Categorías'],
          summary: 'Actualizar categoría',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Categoría actualizada' } },
        },
        patch: {
          tags: ['Categorías'],
          summary: 'Actualizar categoría parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Categoría actualizada' } },
        },
        delete: {
          tags: ['Categorías'],
          summary: 'Eliminar categoría',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Categoría eliminada' } },
        },
      },

      // ─── E S T A D Í S T I C A S   P A Í S ──────────────────
      '/api/estadisticas-pais': {
        get: {
          tags: ['Estadísticas por País'],
          summary: 'Listar estadísticas',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'pais_id', in: 'query', schema: { type: 'integer' } }],
          responses: { 200: { description: 'Lista de estadísticas' } },
        },
        post: {
          tags: ['Estadísticas por País'],
          summary: 'Crear estadística',
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: 'Estadística creada' } },
        },
      },
      '/api/estadisticas-pais/{id}': {
        get: {
          tags: ['Estadísticas por País'],
          summary: 'Obtener estadística por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Estadística encontrada' } },
        },
        put: {
          tags: ['Estadísticas por País'],
          summary: 'Actualizar estadística',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Estadística actualizada' } },
        },
        patch: {
          tags: ['Estadísticas por País'],
          summary: 'Actualizar estadística parcial',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Estadística actualizada' } },
        },
        delete: {
          tags: ['Estadísticas por País'],
          summary: 'Eliminar estadística',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Estadística eliminada' } },
        },
      },

      // ─── N O T I F I C A C I O N E S ────────────────────────
      '/api/notificaciones': {
        get: {
          tags: ['Notificaciones'],
          summary: 'Listar notificaciones del usuario',
          description: 'Filtro opcional: ?soloNoLeidas=true',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de notificaciones' } },
        },
      },
      '/api/notificaciones/contar': {
        get: {
          tags: ['Notificaciones'],
          summary: 'Contar notificaciones no leídas',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Conteo' } },
        },
      },
      '/api/notificaciones/leer-todas': {
        patch: {
          tags: ['Notificaciones'],
          summary: 'Marcar todas como leídas',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Notificaciones marcadas' } },
        },
      },
      '/api/notificaciones/{id}/leer': {
        patch: {
          tags: ['Notificaciones'],
          summary: 'Marcar notificación como leída',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Notificación marcada' } },
        },
      },

      // ─── H I S T O R I A L   N O T I C I A S ────────────────
      '/api/historial-noticias/noticia/{noticiaId}': {
        get: {
          tags: ['Historial de Noticias'],
          summary: 'Listar versiones de una noticia',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'noticiaId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Versiones de la noticia' } },
        },
      },
      '/api/historial-noticias/{id}': {
        get: {
          tags: ['Historial de Noticias'],
          summary: 'Obtener versión específica',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Versión encontrada' } },
        },
      },

      // ─── C O M E N T A R I O S ──────────────────────────────
      '/api/comentarios/public/{noticiaId}': {
        get: {
          tags: ['Comentarios'],
          summary: 'Comentarios públicos de una noticia',
          description: 'Solo devuelve comentarios aprobados.',
          security: [],
          parameters: [{ name: 'noticiaId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Lista de comentarios aprobados' } },
        },
      },
      '/api/comentarios/public': {
        post: {
          tags: ['Comentarios'],
          summary: 'Enviar comentario (público)',
          description: 'Queda pendiente de moderación.',
          security: [],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ComentarioCreateRequest' } } } },
          responses: { 201: { description: 'Comentario enviado (pendiente)' } },
        },
      },
      '/api/comentarios': {
        get: {
          tags: ['Comentarios'],
          summary: 'Listar comentarios (admin)',
          description: 'Filtros: limit, offset, estado, noticia_id.',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de comentarios' } },
        },
      },
      '/api/comentarios/{id}': {
        get: {
          tags: ['Comentarios'],
          summary: 'Obtener comentario por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Comentario encontrado' } },
        },
        delete: {
          tags: ['Comentarios'],
          summary: 'Eliminar comentario',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Comentario eliminado' } },
        },
      },
      '/api/comentarios/{id}/moderar': {
        patch: {
          tags: ['Comentarios'],
          summary: 'Moderar comentario',
          description: 'Aprobar o rechazar un comentario.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ComentarioModerarRequest' } } } },
          responses: { 200: { description: 'Comentario moderado' } },
        },
      },

      // ─── P Ú B L I C O   ( E S P A Ñ O L ) ──────────────────
      '/api/public/paises/{countrySlug}/noticias': {
        get: {
          tags: ['Público (español)'],
          summary: 'Noticias públicas por país (ruta en español)',
          security: [],
          parameters: [{ name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Noticias publicadas' } },
        },
      },
      '/api/public/paises/{countrySlug}/noticias/{newsSlug}': {
        get: {
          tags: ['Público (español)'],
          summary: 'Detalle de noticia (ruta en español)',
          security: [],
          parameters: [
            { name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'newsSlug', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Detalle de noticia' } },
        },
      },
      '/api/public/paises/{countrySlug}/testimonios': {
        get: {
          tags: ['Público (español)'],
          summary: 'Testimonios públicos por país (ruta en español)',
          security: [],
          parameters: [{ name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Testimonios aprobados' } },
        },
      },
      '/api/public/paises/{countrySlug}/solicitudes': {
        post: {
          tags: ['Público (español)'],
          summary: 'Enviar solicitud de contacto (ruta en español)',
          security: [],
          parameters: [{ name: 'countrySlug', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactRequestCreateRequest' } } } },
          responses: { 201: { description: 'Solicitud enviada' } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
