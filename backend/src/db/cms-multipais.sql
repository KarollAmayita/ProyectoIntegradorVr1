-- ============================================
-- CMS MULTIPAIS - Script SQL Completo
-- ============================================

-- Tabla paises
create table paises (
  id bigint generated always as identity primary key,
  nombre text not null,
  codigo text not null unique,
  slug text not null unique,
  estado text not null default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla roles
create table roles (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  descripcion text,
  created_at timestamptz default now()
);

-- Tabla usuarios
create table usuarios (
  id bigint generated always as identity primary key,
  nombre text not null,
  apellido text not null,
  email text not null unique,
  username text not null unique,
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

-- Tabla noticias
create table noticias (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  titulo text not null,
  slug text not null,
  resumen text not null,
  contenido text not null,
  imagen_principal_url text,
  autor_id bigint not null references usuarios(id),
  estado text not null default 'borrador',
  fecha_publicacion timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint noticias_estado_check check (estado in ('borrador', 'publicado', 'despublicado')),
  constraint noticias_slug_pais_unique unique (pais_id, slug)
);

-- Tabla testimonios
create table testimonios (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  nombre text not null,
  cargo text,
  empresa text,
  contenido text not null,
  foto_url text not null,
  instagram_url text,
  facebook_url text,
  estado text not null default 'borrador',
  destacado boolean not null default false,
  autor_id bigint references usuarios(id),
  fecha_publicacion timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint testimonios_estado_check check (estado in ('borrador', 'publicado', 'despublicado'))
);

-- Tabla solicitudes_contacto
create table solicitudes_contacto (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  nombre text not null,
  correo text not null,
  telefono text not null,
  finalidad text not null,
  mensaje text,
  estado text not null default 'pendiente',
  observaciones_admin text,
  fecha_gestion timestamptz,
  gestionado_por bigint references usuarios(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint solicitudes_estado_check check (estado in ('pendiente', 'en_proceso', 'gestionada', 'cerrada')),
  constraint solicitudes_finalidad_check check (finalidad in ('Servicio', 'Programa EDIFICA', 'Shows y conferencias'))
);

-- Tabla refresh_tokens
create table refresh_tokens (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references usuarios(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- ============================================
-- Datos iniciales
-- ============================================

insert into paises (nombre, codigo, slug) values
('Chile', 'CL', 'chile'),
('Argentina', 'AR', 'argentina'),
('Ecuador', 'EC', 'ecuador');

insert into roles (nombre, descripcion) values
('superadmin', 'Administrador general del sistema'),
('admin_pais', 'Administrador de un país específico'),
('editor', 'Usuario editor de contenidos');

-- ============================================
-- Tabla: archivos (centraliza imagenes/recursos)
-- ============================================

create table if not exists archivos (
  id bigint generated always as identity primary key,
  noticia_id bigint references noticias(id) on delete set null,
  testimonio_id bigint references testimonios(id) on delete set null,
  url text not null,
  nombre text not null,
  tipo text not null default 'imagen',
  peso_bytes bigint,
  storage_path text,
  subido_por bigint references usuarios(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint archivos_tipo_check check (tipo in ('imagen', 'pdf', 'video', 'documento', 'otro'))
);

-- ============================================
-- Tabla: auditoria (bitacora de eventos)
-- ============================================

create table if not exists auditoria (
  id bigint generated always as identity primary key,
  usuario_id bigint references usuarios(id) on delete set null,
  username text,
  accion text not null,
  modulo text not null,
  detalle jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- ============================================
-- Migración: Recuperación de contraseña
-- ============================================

alter table usuarios
add column if not exists pregunta_seguridad text,
add column if not exists respuesta_seguridad_hash text,
add column if not exists password_updated_at timestamptz;

-- ============================================
-- Tabla: historial_conexiones
-- ============================================

create table if not exists historial_conexiones (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references usuarios(id) on delete cascade,
  username text not null,
  ip_address text,
  lugar text,
  jwt_token text,
  user_agent text,
  created_at timestamptz default now(),
  logout_at timestamptz
);

-- ============================================
-- Tabla: categorias
-- ============================================

create table if not exists categorias (
  id bigint generated always as identity primary key,
  nombre text not null,
  slug text not null unique,
  descripcion text,
  created_at timestamptz default now()
);

-- ============================================
-- Tabla: noticia_categorias (M:M)
-- ============================================

create table if not exists noticia_categorias (
  noticia_id bigint not null references noticias(id) on delete cascade,
  categoria_id bigint not null references categorias(id) on delete cascade,
  primary key (noticia_id, categoria_id)
);

-- ============================================
-- Tabla: estadisticas_pais
-- ============================================

create table if not exists estadisticas_pais (
  id bigint generated always as identity primary key,
  pais_id bigint not null references paises(id) on delete cascade,
  indicador text not null,
  valor text not null,
  unidad text,
  periodo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Tabla: notificaciones
-- ============================================

create table if not exists notificaciones (
  id bigint generated always as identity primary key,
  usuario_id bigint references usuarios(id) on delete cascade,
  titulo text not null,
  mensaje text not null,
  tipo text not null default 'info',
  leida boolean not null default false,
  created_at timestamptz default now(),
  constraint notificaciones_tipo_check check (tipo in ('info', 'exito', 'advertencia', 'error'))
);

-- ============================================
-- Tabla: historial_noticias
-- ============================================

create table if not exists historial_noticias (
  id bigint generated always as identity primary key,
  noticia_id bigint not null references noticias(id) on delete cascade,
  usuario_id bigint references usuarios(id) on delete set null,
  titulo_anterior text,
  contenido_anterior text,
  estado_anterior text,
  cambios jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- Tabla: comentarios
-- ============================================

create table if not exists comentarios (
  id bigint generated always as identity primary key,
  noticia_id bigint not null references noticias(id) on delete cascade,
  nombre text not null,
  email text,
  contenido text not null,
  estado text not null default 'pendiente',
  created_at timestamptz default now(),
  constraint comentarios_estado_check check (estado in ('pendiente', 'aprobado', 'rechazado'))
);
