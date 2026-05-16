const historialNoticiaService = require('../services/historialNoticiaService');

const listar = async (req, res) => {
  try {
    const versiones = await historialNoticiaService.listarPorNoticia(req.params.noticiaId);
    return res.status(200).json({ success: true, data: versiones });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const obtener = async (req, res) => {
  try {
    const version = await historialNoticiaService.obtener(req.params.id);
    if (!version) return res.status(404).json({ success: false, message: 'Versión no encontrada' });
    return res.status(200).json({ success: true, data: version });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { listar, obtener };
