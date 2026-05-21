const NotificacionRepository = require('../../../ports/repositories/notificacionRepository');

/**
 * @param {NotificacionRepository} notificacionRepository
 */
const createMarcarLeidaNotificacionUseCase = (notificacionRepository) => {
  /**
   * @param {number} id
   * @param {number} usuarioId
   * @returns {Promise<import('../../../domain/entities/notificacion').default>}
   */
  return async (id, usuarioId) => {
    const notif = await notificacionRepository.findById(id);
    if (!notif || Number(notif.usuario_id) !== Number(usuarioId)) {
      throw new Error('Notificación no encontrada');
    }
    return notificacionRepository.marcarLeida(id);
  };
};

module.exports = createMarcarLeidaNotificacionUseCase;
