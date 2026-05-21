const { AppError } = require('../../../../utils/errors');

class ProfileController {
  constructor(obtenerProfileUseCase) {
    this.obtenerProfileUseCase = obtenerProfileUseCase;
  }

  getProfile = async (req, res) => {
    try {
      const result = await this.obtenerProfileUseCase(req.user);
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

module.exports = ProfileController;
