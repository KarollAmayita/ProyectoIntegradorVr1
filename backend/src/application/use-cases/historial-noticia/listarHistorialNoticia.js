const HistorialNoticiaRepository = require('../../../ports/repositories/historialNoticiaRepository');
const NoticiaRepository = require('../../../ports/repositories/noticiaRepository');

/**
 * @param {HistorialNoticiaRepository} historialNoticiaRepository
 * @param {NoticiaRepository} noticiaRepository
 */
const createListarHistorialNoticiaUseCase = (historialNoticiaRepository, noticiaRepository) => {
  /**
   * @param {number} noticiaId
   * @param {Object} user
   * @returns {Promise<import('../../../domain/entities/historialNoticia').default[]>}
   */
  return async (noticiaId, user) => {
    if (user?.rol !== 'superadmin' && user?.pais_id) {
      const noticia = await noticiaRepository.findById(noticiaId);
      if (!noticia || Number(noticia.pais_id) !== Number(user.pais_id)) {
        throw new Error('No tiene permisos para ver el historial de esta noticia');
      }
    }
    return historialNoticiaRepository.findByNoticiaId(noticiaId);
  };
};

module.exports = createListarHistorialNoticiaUseCase;
