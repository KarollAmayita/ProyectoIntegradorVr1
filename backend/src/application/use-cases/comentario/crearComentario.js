const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createCrearComentarioUseCase = (comentarioRepository) => {
  return async ({ noticia_id, nombre, email, contenido }) => {
    if (!noticia_id || !nombre || !contenido) throw new Error('Noticia, nombre y contenido son obligatorios');
    if (email && !isValidEmail(email)) throw new Error('Email no válido');
    return comentarioRepository.create({ noticia_id, nombre, email: email || null, contenido, estado: 'pendiente' });
  };
};

module.exports = createCrearComentarioUseCase;
