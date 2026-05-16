const comentarioService = require('../services/comentarioService');

const listar = async (req, res) => {
  try {
    const { limit, offset, estado, noticia_id } = req.query;
    const { data, count } = await comentarioService.listar({
      limit: parseInt(limit) || 50, offset: parseInt(offset) || 0,
      estado: estado || undefined, noticia_id: noticia_id || undefined,
    });
    return res.status(200).json({ success: true, data, total: count });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const listarPublicos = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const { data, count } = await comentarioService.listarPublicos(req.params.noticiaId, {
      limit: parseInt(limit) || 50, offset: parseInt(offset) || 0,
    });
    return res.status(200).json({ success: true, data, total: count });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const obtener = async (req, res) => {
  try {
    const data = await comentarioService.obtener(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(404).json({ success: false, message: error.message }); }
};

const crear = async (req, res) => {
  try {
    const data = await comentarioService.crear(req.body);
    return res.status(201).json({ success: true, message: 'Comentario enviado. Pendiente de moderación.', data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const moderar = async (req, res) => {
  try {
    const { estado } = req.body;
    const data = await comentarioService.moderar(req.params.id, estado);
    return res.status(200).json({ success: true, message: 'Comentario moderado', data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const eliminar = async (req, res) => {
  try {
    const result = await comentarioService.eliminar(req.params.id);
    return res.status(200).json(result);
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { listar, listarPublicos, obtener, crear, moderar, eliminar };
