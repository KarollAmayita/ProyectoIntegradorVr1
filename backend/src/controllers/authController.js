const authService = require('../services/authService');
const { AppError } = require('../utils/errors');

const login = async (req, res, next) => {
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

    const result = await authService.login({ username, password, ipAddress, userAgent });
    return res.status(200).json({
      success: true,
      ...result
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

const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, username, password, rol_id, pais_id } = req.body;

    if (!nombre || !apellido || !email || !username || !password || !rol_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos obligatorios deben ser enviados' 
      });
    }

    const result = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      ...result
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

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refresh token es obligatorio' 
      });
    }

    const result = await authService.refreshToken(refreshToken);
    return res.status(200).json({
      success: true,
      ...result
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

const logout = async (req, res, next) => {
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

    const result = await authService.logout(refreshToken, userId, accessToken);
    return res.status(200).json({
      success: true,
      ...result
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

const logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const accessToken = req.headers.authorization?.split(' ')[1];
    const result = await authService.logoutAll(userId, accessToken);
    return res.status(200).json({
      success: true,
      ...result
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

const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Usuario o correo es obligatorio' });
    }

    const result = await authService.forgotPassword(identifier);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, respuesta_seguridad, nueva_password } = req.body;

    if (!username || !respuesta_seguridad || !nueva_password) {
      return res.status(400).json({ success: false, message: 'Usuario, respuesta de seguridad y nueva contraseña son obligatorios' });
    }

    const result = await authService.resetPassword(username, respuesta_seguridad, nueva_password);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password_actual, nueva_password } = req.body;

    if (!password_actual || !nueva_password) {
      return res.status(400).json({ success: false, message: 'Contraseña actual y nueva contraseña son obligatorias' });
    }

    const result = await authService.changePassword(userId, password_actual, nueva_password);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const updateSecurityQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pregunta_seguridad, respuesta_seguridad } = req.body;

    if (!pregunta_seguridad || !respuesta_seguridad) {
      return res.status(400).json({ success: false, message: 'Pregunta y respuesta de seguridad son obligatorias' });
    }

    const result = await authService.updateSecurityQuestion(userId, pregunta_seguridad, respuesta_seguridad);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await authService.getMyProfile(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getMySecurityQuestion = async (req, res, next) => {
  try {
    const result = await authService.getMySecurityQuestion(req.user.id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const endSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token requerido' });
    await authService.endSession(refreshToken);
    return res.status(200).json({ success: true, message: 'Sesión finalizada' });
  } catch (error) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const getPublicSecurityQuestion = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    const result = await authService.getPublicSecurityQuestion(identifier);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message });
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
  updateSecurityQuestion,
  getMyProfile,
  getMySecurityQuestion,
  getPublicSecurityQuestion,
  endSession,
};