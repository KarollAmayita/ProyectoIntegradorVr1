const createListarComentariosPublicosUseCase = (comentarioRepository) => {
  return async (noticiaId, { limit = 50, offset = 0 } = {}) => {
    return comentarioRepository.findByNoticiaId(noticiaId, { limit, offset });
  };
};

module.exports = createListarComentariosPublicosUseCase;
