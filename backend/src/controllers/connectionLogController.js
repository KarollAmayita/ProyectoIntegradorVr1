const connectionLogService = require('../services/connectionLogService');
const { AppError } = require('../utils/errors');

const list = async (req, res) => {
  try {
    const { limit, offset, username } = req.query;

    const params = {};
    if (limit) params.limit = parseInt(limit, 10);
    if (offset) params.offset = parseInt(offset, 10);
    if (username) params.username = username;

    const { data, count } = await connectionLogService.getLogs(params);

    return res.status(200).json({
      success: true,
      data,
      total: count,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await connectionLogService.getLogById(id);

    if (!log) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    return res.status(200).json({ success: true, data: log });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const summary = async (req, res) => {
  try {
    const data = await connectionLogService.getSummary();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = {
  list,
  getById,
  summary,
};
