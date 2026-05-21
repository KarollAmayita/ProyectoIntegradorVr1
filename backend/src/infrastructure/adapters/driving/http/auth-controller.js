const { AppError } = require('../../../../utils/errors');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Usuario y contraseña son obligatorios' 
        });
      }

      const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
      const userAgent = req.headers['user-agent'] || null;

      const result = await this.authService.login({ username, password, ipAddress, userAgent });
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  register = async (req, res) => {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json({
        success: true,
        ...result
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ 
          success: false, 
          message: 'Refresh token es obligatorio' 
        });
      }

      const result = await this.authService.refreshToken(refreshToken);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  logout = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const accessToken = req.headers.authorization?.split(' ')[1];
      const userId = req.user?.id;

      if (!refreshToken) {
        return res.status(400).json({ 
          success: false, 
          message: 'Refresh token es obligatorio' 
        });
      }

      const result = await this.authService.logout(refreshToken, userId, accessToken);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  logoutAll = async (req, res) => {
    try {
      const userId = req.user.id;
      const accessToken = req.headers.authorization?.split(' ')[1];
      const result = await this.authService.logoutAll(userId, accessToken);
      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  forgotPassword = async (req, res) => {
    try {
      const { identifier } = req.body;
      const result = await this.authService.forgotPassword(identifier);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { username, respuesta_seguridad, nueva_password } = req.body;
      const result = await this.authService.resetPassword(username, respuesta_seguridad, nueva_password);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  changePassword = async (req, res) => {
    try {
      const userId = req.user.id;
      const { password_actual, nueva_password } = req.body;
      const result = await this.authService.changePassword(userId, password_actual, nueva_password);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateSecurityQuestion = async (req, res) => {
    try {
      const userId = req.user.id;
      const { pregunta_seguridad, respuesta_seguridad } = req.body;
      const result = await this.authService.updateSecurityQuestion(userId, pregunta_seguridad, respuesta_seguridad);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getMyProfile = async (req, res) => {
    try {
      const user = await this.authService.getMyProfile(req.user.id);
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getMySecurityQuestion = async (req, res) => {
    try {
      const result = await this.authService.getMySecurityQuestion(req.user.id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getPublicSecurityQuestion = async (req, res) => {
    try {
      const { identifier } = req.body;
      const result = await this.authService.getPublicSecurityQuestion(identifier);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  endSession = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token requerido' });
      await this.authService.endSession(refreshToken);
      return res.status(200).json({ success: true, message: 'Sesión finalizada' });
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

module.exports = AuthController;
