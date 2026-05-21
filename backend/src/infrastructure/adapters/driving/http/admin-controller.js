const { AppError } = require('../../../../utils/errors');

class AdminController {
  constructor(obtenerPanelAdminUseCase) {
    this.obtenerPanelAdminUseCase = obtenerPanelAdminUseCase;
  }

  getAdminPanel = async (req, res) => {
    try {
      const result = await this.obtenerPanelAdminUseCase(req.user);
      return res.status(200).json(result);
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
}

module.exports = AdminController;
