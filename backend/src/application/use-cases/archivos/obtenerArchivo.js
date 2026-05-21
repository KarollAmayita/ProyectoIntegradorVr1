/**
 * @param {import('../../../ports/repositories/archivoRepository').default} archivoRepository
 */
const createObtenerArchivoUseCase = (archivoRepository) => {
  /**
   * @param {string} id
   * @returns {Promise<import('../../../domain/entities/archivo').default | null>}
   */
  return async (id) => {
    return archivoRepository.findById(id);
  };
};

module.exports = createObtenerArchivoUseCase;
