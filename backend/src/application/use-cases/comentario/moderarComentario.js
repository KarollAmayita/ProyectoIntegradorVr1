const createModerarComentarioUseCase = (comentarioRepository, noticiaRepository) => {
  return async (id, estado, user) => {
    if (!['aprobado', 'rechazado'].includes(estado)) throw new Error('Estado no válido');

    const existing = await comentarioRepository.findById(id);
    if (!existing) throw new Error('Comentario no encontrado');

    if (user?.rol !== 'superadmin' && user?.pais_id) {
      const noticia = await noticiaRepository.findById(existing.noticia_id);
      if (!noticia || Number(noticia.pais_id) !== Number(user.pais_id)) {
        throw new Error('No tiene permisos para moderar este comentario');
      }
    }

    return comentarioRepository.updateEstado(id, estado);
  };
};

module.exports = createModerarComentarioUseCase;
