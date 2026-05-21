const createEliminarComentarioUseCase = (comentarioRepository, noticiaRepository) => {
  return async (id, user) => {
    const existing = await comentarioRepository.findById(id);
    if (!existing) throw new Error('Comentario no encontrado');

    if (user?.rol !== 'superadmin' && user?.pais_id) {
      const noticia = await noticiaRepository.findById(existing.noticia_id);
      if (!noticia || Number(noticia.pais_id) !== Number(user.pais_id)) {
        throw new Error('No tiene permisos para eliminar este comentario');
      }
    }

    await comentarioRepository.remove(id);
    return { message: 'Comentario eliminado correctamente' };
  };
};

module.exports = createEliminarComentarioUseCase;
