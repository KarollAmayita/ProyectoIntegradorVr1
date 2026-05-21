const NotificacionRepository = require('../../../ports/repositories/notificacionRepository');

/**
 * @param {NotificacionRepository} notificacionRepository
 */
const createListarNotificacionesUseCase = (notificacionRepository) => {
  /**
   * @param {number} usuarioId
   * @param {Object} [params]
   * @param {number} [params.limit=50]
   * @param {number} [params.offset=0]
   * @param {boolean} [params.soloNoLeidas=false]
   * @returns {Promise<{ data: import('../../../domain/entities/notificacion').default[], count: number }>}
   */
  return async (usuarioId, { limit = 50, offset = 0, soloNoLeidas = false } = {}) => {
    return notificacionRepository.findByUsuarioId(usuarioId, { limit, offset, soloNoLeidas });
  };
};

module.exports = createListarNotificacionesUseCase;
