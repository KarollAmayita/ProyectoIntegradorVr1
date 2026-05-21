const HistorialNoticiaRepository = require('../../../ports/repositories/historialNoticiaRepository');

/**
 * @param {HistorialNoticiaRepository} historialNoticiaRepository
 */
const createObtenerHistorialNoticiaUseCase = (historialNoticiaRepository) => {
  /**
   * @param {number} id
   * @returns {Promise<import('../../../domain/entities/historialNoticia').default | null>}
   */
  return async (id) => {
    return historialNoticiaRepository.findById(id);
  };
};

module.exports = createObtenerHistorialNoticiaUseCase;
