const { AppError } = require('../../../utils/errors');

class CategoriaController {
  constructor(categoriaService) {
    this.categoriaService = categoriaService;
  }

  listar = async (req, res) => {
    try {
      const data = await this.categoriaService.listar();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  obtener = async (req, res) => {
    try {
      const data = await this.categoriaService.obtener(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  crear = async (req, res) => {
    try {
      const data = await this.categoriaService.crear(req.body);
      return res.status(201).json({ success: true, message: 'Categoría creada', data });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  actualizar = async (req, res) => {
    try {
      const data = await this.categoriaService.actualizar(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Categoría actualizada', data });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  eliminar = async (req, res) => {
    try {
      const result = await this.categoriaService.eliminar(req.params.id);
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

module.exports = CategoriaController;
