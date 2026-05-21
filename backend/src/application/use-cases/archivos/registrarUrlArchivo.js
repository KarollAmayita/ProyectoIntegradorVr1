/**
 * @param {import('../../../ports/repositories/archivoRepository').default} archivoRepository
 * @param {import('../../../ports/services/auditoriaService').default} auditoriaService
 */
const createRegistrarUrlArchivoUseCase = (archivoRepository, auditoriaService) => {
  /**
   * @param {Object} payload
   * @param {string} payload.url
   * @param {string} payload.nombre
   * @param {string} [payload.tipo]
   * @param {string} [payload.noticia_id]
   * @param {string} [payload.testimonio_id]
   * @param {Object} user
   * @param {string} ip_address
   * @returns {Promise<import('../../../domain/entities/archivo').default>}
   */
  return async (payload, user, ip_address) => {
    const { url, nombre, tipo = 'imagen', noticia_id, testimonio_id } = payload;
    if (!url || !nombre) throw new Error('URL y nombre son obligatorios');

    const archivo = await archivoRepository.create({
      url,
      nombre,
      tipo,
      noticia_id: noticia_id || null,
      testimonio_id: testimonio_id || null,
      subido_por: user.id
    });

    auditoriaService.registrar({
      usuario_id: user.id,
      username: user.username,
      accion: 'Registrar URL de archivo',
      modulo: 'archivos',
      detalle: { nombre: payload.nombre, url: payload.url, tipo: payload.tipo },
      ip_address
    }).catch(() => {});

    return archivo;
  };
};

module.exports = createRegistrarUrlArchivoUseCase;
