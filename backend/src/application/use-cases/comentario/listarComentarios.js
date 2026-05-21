const createListarComentariosUseCase = (comentarioRepository, noticiaRepository) => {
  return async ({
    limit = 50,
    offset = 0,
    estado,
    noticia_id,
    user
  }) => {
    if (user?.rol === 'admin_pais' && user?.pais_id) {
      const paisId = user.pais_id;
      const noticia_ids = await noticiaRepository.findAllIdsByPais(paisId);
      if (noticia_ids.length === 0) return { data: [], count: 0 };
      return comentarioRepository.findAll({ limit, offset, estado, noticia_id, noticia_ids });
    }
    return comentarioRepository.findAll({ limit, offset, estado, noticia_id });
  };
};

module.exports = createListarComentariosUseCase;
