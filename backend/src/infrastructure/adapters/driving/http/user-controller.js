const { AppError } = require('../../../../utils/errors');

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  listUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers(req.user);
      return res.status(200).json(users);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  createUser = async (req, res) => {
    try {
      const user = await this.userService.createUser(req.body, req.user, req.ip);
      return res.status(201).json({
        message: 'Usuario creado correctamente',
        data: user,
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updatePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { nueva_password } = req.body;
      await this.userService.updatePassword(id, nueva_password);
      return res.status(200).json({
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateUser = async (req, res) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body, req.user);
      return res.status(200).json({ message: 'Usuario actualizado correctamente', data: user });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  deactivateUser = async (req, res) => {
    try {
      const result = await this.userService.deactivateUser(req.params.id, req.user, req.ip);
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  deleteUserPermanent = async (req, res) => {
    try {
      const result = await this.userService.deleteUserPermanent(req.params.id, req.user, req.ip);
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

module.exports = UserController;
