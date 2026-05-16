const notificacionService = require('../services/notificacionService');

const listar = async (req, res) => {
  try {
    const { limit, offset, soloNoLeidas } = req.query;
    const { data, count } = await notificacionService.listar(req.user.id, {
      limit: parseInt(limit) || 50, offset: parseInt(offset) || 0,
      soloNoLeidas: soloNoLeidas === 'true',
    });
    return res.status(200).json({ success: true, data, total: count });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const marcarLeida = async (req, res) => {
  try {
    await notificacionService.marcarLeida(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Notificación marcada como leída' });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const marcarTodasLeidas = async (req, res) => {
  try {
    await notificacionService.marcarTodasLeidas(req.user.id);
    return res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const contar = async (req, res) => {
  try {
    const count = await notificacionService.contarNoLeidas(req.user.id);
    return res.status(200).json({ success: true, data: { noLeidas: count } });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { listar, marcarLeida, marcarTodasLeidas, contar };
