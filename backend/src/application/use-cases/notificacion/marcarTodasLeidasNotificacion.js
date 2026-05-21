const NotificacionRepository = require('../../../ports/repositories/notificacionRepository');

/**
 * @param {NotificacionRepository} notificacionRepository
 */
const createMarcarTodasLeidasNotificacionUseCase = (notificacionRepository) => {
  /**
   * @param {number} usuarioId
   * @returns {Promise<void>}
   */
  return async (usuarioId) => {
    await notificacionRepository.marcarTodasLeidas(usuarioId);
  };
};

module.exports = createMarcarTodasLeidasNotificacionUseCase;
