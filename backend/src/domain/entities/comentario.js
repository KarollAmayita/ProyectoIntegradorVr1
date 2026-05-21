const createComentario = ({
  id,
  noticia_id,
  nombre,
  email = null,
  contenido,
  estado = 'pendiente',
  created_at,
  updated_at,
  noticias = null
} = {}) => ({
  id,
  noticia_id,
  nombre,
  email,
  contenido,
  estado,
  created_at,
  updated_at,
  noticias
});

module.exports = createComentario;
