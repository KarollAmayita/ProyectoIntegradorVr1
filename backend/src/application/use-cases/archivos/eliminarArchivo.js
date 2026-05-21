/**
 * @param {import('../../../ports/repositories/archivoRepository').default} archivoRepository
 * @param {import('../../../ports/services/storageService').default} storageService
 * @param {import('../../../ports/services/auditoriaService').default} auditoriaService
 */
const createEliminarArchivoUseCase = (archivoRepository, storageService, auditoriaService) => {
  /**
   * @param {string} id
   * @param {Object} user
   * @param {string} ip_address
   * @returns {Promise<{ message: string }>}
   */
  return async (id, user, ip_address) => {
    const existing = await archivoRepository.findById(id);
    if (!existing) throw new Error('Archivo no encontrado');

    if (existing.storage_path) {
      await storageService.remove(existing.storage_path);
    }

    await archivoRepository.remove(id);

    auditoriaService.registrar({
      usuario_id: user.id,
      username: user.username,
      accion: 'Eliminar archivo',
      modulo: 'archivos',
      detalle: { id },
      ip_address
    }).catch(() => {});

    return { message: 'Archivo eliminado correctamente' };
  };
};

module.exports = createEliminarArchivoUseCase;
