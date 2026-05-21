/**
 * @param {import('../../../ports/repositories/archivoRepository').default} archivoRepository
 */
const createActualizarArchivoUseCase = (archivoRepository) => {
  /**
   * @param {string} id
   * @param {Object} payload
   * @param {Object} user
   * @returns {Promise<import('../../../domain/entities/archivo').default>}
   */
  return async (id, payload, user) => {
    const existing = await archivoRepository.findById(id);
    if (!existing) throw new Error('Archivo no encontrado');

    return archivoRepository.update(id, {
      ...payload,
      updated_at: new Date().toISOString()
    });
  };
};

module.exports = createActualizarArchivoUseCase;
