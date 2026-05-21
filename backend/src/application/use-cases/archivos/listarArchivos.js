const ArchivoRepository = require('../../../ports/repositories/archivoRepository');
const NoticiaRepository = require('../../../ports/repositories/noticiaRepository');
const TestimonioRepository = require('../../../ports/repositories/testimonioRepository');

/**
 * @param {ArchivoRepository} archivoRepository
 * @param {NoticiaRepository} noticiaRepository
 * @param {TestimonioRepository} testimonioRepository
 */
const createListarArchivosUseCase = (
  archivoRepository,
  noticiaRepository,
  testimonioRepository
) => {
  /**
   * @param {Object} params
   * @param {number} [params.limit=50]
   * @param {number} [params.offset=0]
   * @param {string} [params.tipo]
   * @param {string} [params.noticia_id]
   * @param {string} [params.testimonio_id]
   * @param {Object} params.user
   * @returns {Promise<{ data: import('../../../domain/entities/archivo').default[], count: number }>}
   */
  return async ({
    limit = 50,
    offset = 0,
    tipo,
    noticia_id,
    testimonio_id,
    user
  }) => {
    if (user?.rol === 'admin_pais' && user?.pais_id) {
      const paisId = user.pais_id;
      const [noticia_ids, testimonio_ids] = await Promise.all([
        noticiaRepository.findAllIdsByPais(paisId),
        testimonioRepository.findAllIdsByPais(paisId)
      ]);
      
      return archivoRepository.findAll({
        limit,
        offset,
        tipo,
        noticia_id,
        testimonio_id,
        noticia_ids,
        testimonio_ids
      });
    }

    return archivoRepository.findAll({
      limit,
      offset,
      tipo,
      noticia_id,
      testimonio_id
    });
  };
};

module.exports = createListarArchivosUseCase;
