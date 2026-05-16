const archivosService = require('../services/archivosService');

const listar = async (req, res) => {
  try {
    const { limit, offset, tipo, noticia_id, testimonio_id } = req.query;
    const { data, count } = await archivosService.listar({
      limit: parseInt(limit) || 50, offset: parseInt(offset) || 0,
      tipo: tipo || undefined, noticia_id: noticia_id || undefined, testimonio_id: testimonio_id || undefined,
    });
    return res.status(200).json({ success: true, data, total: count });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const obtener = async (req, res) => {
  try {
    const archivo = await archivosService.obtener(req.params.id);
    if (!archivo) return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    return res.status(200).json({ success: true, data: archivo });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const registrarUrl = async (req, res) => {
  try {
    const archivo = await archivosService.registrarUrl(req.body, req.user);
    return res.status(201).json({ success: true, message: 'Archivo registrado', data: archivo });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const upload = async (req, res) => {
  try {
    if (!req.files || !req.files.archivo) return res.status(400).json({ success: false, message: 'Archivo requerido' });
    const archivo = await archivosService.upload(req.files.archivo, req.body, req.user);
    return res.status(201).json({ success: true, message: 'Archivo subido', data: archivo });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const actualizar = async (req, res) => {
  try {
    const archivo = await archivosService.actualizar(req.params.id, req.body, req.user);
    return res.status(200).json({ success: true, message: 'Archivo actualizado', data: archivo });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const eliminar = async (req, res) => {
  try {
    const result = await archivosService.eliminar(req.params.id);
    return res.status(200).json(result);
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { listar, obtener, registrarUrl, upload, actualizar, eliminar };
