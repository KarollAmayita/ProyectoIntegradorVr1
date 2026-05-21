/**
 * @param {Function} listarNotificacionesUseCase
 * @param {Function} marcarLeidaNotificacionUseCase
 * @param {Function} marcarTodasLeidasNotificacionUseCase
 * @param {Function} contarNotificacionesNoLeidasUseCase
 */
const createHttpNotificacionController = (
  listarNotificacionesUseCase,
  marcarLeidaNotificacionUseCase,
  marcarTodasLeidasNotificacionUseCase,
  contarNotificacionesNoLeidasUseCase
) => {
  return {
    listar: async (req, res) => {
      try {
        const { limit, offset, soloNoLeidas } = req.query;
        const { data, count } = await listarNotificacionesUseCase(req.user.id, {
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0,
          soloNoLeidas: soloNoLeidas === 'true',
        });
        return res.status(200).json({ success: true, data, total: count });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    marcarLeida: async (req, res) => {
      try {
        await marcarLeidaNotificacionUseCase(req.params.id, req.user.id);
        return res.status(200).json({ success: true, message: 'Notificación marcada como leída' });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    },

    marcarTodasLeidas: async (req, res) => {
      try {
        await marcarTodasLeidasNotificacionUseCase(req.user.id);
        return res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    contar: async (req, res) => {
      try {
        const count = await contarNotificacionesNoLeidasUseCase(req.user.id);
        return res.status(200).json({ success: true, data: { noLeidas: count } });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  };
};

module.exports = createHttpNotificacionController;
