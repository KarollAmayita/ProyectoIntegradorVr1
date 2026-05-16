const estadisticaPaisService = require('../services/estadisticaPaisService');

const listar = async (req, res) => {
  try {
    const { pais_id } = req.query;
    const data = await estadisticaPaisService.listar(pais_id || undefined);
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};

const obtener = async (req, res) => {
  try {
    const data = await estadisticaPaisService.obtener(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) { return res.status(404).json({ success: false, message: error.message }); }
};

const crear = async (req, res) => {
  try {
    const data = await estadisticaPaisService.crear(req.body);
    return res.status(201).json({ success: true, message: 'Estadística creada', data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const actualizar = async (req, res) => {
  try {
    const data = await estadisticaPaisService.actualizar(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Estadística actualizada', data });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

const eliminar = async (req, res) => {
  try {
    const result = await estadisticaPaisService.eliminar(req.params.id);
    return res.status(200).json(result);
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
