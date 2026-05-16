const auditoriaService = require('../services/auditoriaService');

const listar = async (req, res) => {
  try {
    const { limit = 50, offset = 0, modulo, usuario_id } = req.query;
    const { data, count } = await auditoriaService.listar({
      limit: parseInt(limit), offset: parseInt(offset),
      modulo: modulo || undefined, usuario_id: usuario_id || undefined,
    });
    return res.status(200).json({ success: true, data, total: count });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const obtener = async (req, res) => {
  try {
    const log = await auditoriaService.obtener(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    return res.status(200).json({ success: true, data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { listar, obtener };
