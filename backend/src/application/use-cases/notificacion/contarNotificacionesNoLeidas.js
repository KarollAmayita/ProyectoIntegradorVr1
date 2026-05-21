const NotificacionRepository = require('../../../ports/repositories/notificacionRepository');

/**
 * @param {NotificacionRepository} notificacionRepository
 */
const createContarNotificacionesNoLeidasUseCase = (notificacionRepository) => {
  /**
   * @param {number} usuarioId
   * @returns {Promise<number>}
   */
  return async (usuarioId) => {
    return notificacionRepository.countNoLeidas(usuarioId);
  };
};

module.exports = createContarNotificacionesNoLeidasUseCase;
