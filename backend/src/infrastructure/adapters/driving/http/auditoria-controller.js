const { AppError } = require('../../../../utils/errors');

class AuditoriaController {
  constructor(auditoriaService) {
    this.auditoriaService = auditoriaService;
  }

  registrar = async (req, res) => {
    try {
      const result = await this.auditoriaService.registrar(req.body);
      return res.status(201).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  listar = async (req, res) => {
    try {
      const { limit, offset, modulo, usuario_id } = req.query;
      const user = req.user;
      const result = await this.auditoriaService.listar({ 
        limit: limit ? parseInt(limit) : 50, 
        offset: offset ? parseInt(offset) : 0, 
        modulo, 
        usuario_id, 
        user 
      });
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  obtener = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.auditoriaService.obtener(id);
      if (!result) return res.status(404).json({ message: 'Auditoría no encontrada' });
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  _handleError(error, res) {
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
}

module.exports = AuditoriaController;
