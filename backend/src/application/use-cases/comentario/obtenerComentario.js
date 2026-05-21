const createObtenerComentarioUseCase = (comentarioRepository) => {
  return async (id) => {
    const comentario = await comentarioRepository.findById(id);
    if (!comentario) throw new Error('Comentario no encontrado');
    return comentario;
  };
};

module.exports = createObtenerComentarioUseCase;
