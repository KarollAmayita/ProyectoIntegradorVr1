const categoriaService = require('../services/categoriaService');

const listar = async (req, res) => {
  try {
    const data = await categoriaService.listar();
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const obtener = async (req, res) => {
  try {
    const data = await categoriaService.obtener(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(404).json({ success: false, message: error.message }); }
};

const crear = async (req, res) => {
  try {
    const data = await categoriaService.crear(req.body);
    return res.status(201).json({ success: true, message: 'Categoría creada', data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const actualizar = async (req, res) => {
  try {
    const data = await categoriaService.actualizar(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Categoría actualizada', data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const eliminar = async (req, res) => {
  try {
    const result = await categoriaService.eliminar(req.params.id);
    return res.status(200).json(result);
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
