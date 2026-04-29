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
  autor_id bigint not null references usuarios(id),
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

-- ============================================
-- Datos iniciales
-- ============================================

insert into paises (nombre, codigo, slug) values
('Colombia', 'CO', 'colombia'),
('Chile', 'CL', 'chile'),
('Ecuador', 'EC', 'ecuador');

insert into roles (nombre, descripcion) values
('superadmin', 'Administrador general del sistema'),
('admin_pais', 'Administrador de un pais especifico'),
('editor', 'Usuario editor de contenidos');