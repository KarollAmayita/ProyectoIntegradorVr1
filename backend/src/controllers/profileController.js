const { AppError } = require('../utils/errors');

const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('No autorizado', 401);
    }

    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getProfile,
};