/**
 * @param {import('../../../ports/repositories/archivoRepository').default} archivoRepository
 * @param {import('../../../ports/services/storageService').default} storageService
 * @param {import('../../../ports/services/auditoriaService').default} auditoriaService
 */
const createUploadArchivoUseCase = (archivoRepository, storageService, auditoriaService) => {
  const determinarTipo = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'imagen';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.startsWith('video/')) return 'video';
    return 'documento';
  };

  /**
   * @param {Object} file
   * @param {Buffer} file.buffer
   * @param {string} file.name
   * @param {string} file.mimetype
   * @param {number} file.size
   * @param {Object} metadata
   * @param {string} [metadata.noticia_id]
   * @param {string} [metadata.testimonio_id]
   * @param {Object} user
   * @param {string} ip_address
   * @returns {Promise<import('../../../domain/entities/archivo').default>}
   */
  return async (file, metadata, user, ip_address) => {
    if (!file) throw new Error('Archivo requerido');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { publicUrl } = await storageService.upload(file, filePath);

    const archivo = await archivoRepository.create({
      url: publicUrl,
      nombre: file.name,
      tipo: determinarTipo(file.mimetype),
      peso_bytes: file.size,
      storage_path: filePath,
      subido_por: user.id,
      noticia_id: metadata.noticia_id || null,
      testimonio_id: metadata.testimonio_id || null,
    });

    auditoriaService.registrar({
      usuario_id: user.id,
      username: user.username,
      accion: 'Subir archivo',
      modulo: 'archivos',
      detalle: { nombre: file.name, tipo: file.mimetype, tamaño: file.size },
      ip_address
    }).catch(() => {});

    return archivo;
  };
};

module.exports = createUploadArchivoUseCase;
