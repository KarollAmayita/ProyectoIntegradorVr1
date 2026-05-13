const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const userService = require('./userService');
const { AuthenticationError, ConflictError, NotFoundError, ValidationError } = require('../utils/errors');

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new AuthenticationError('El usuario y la contraseña son obligatorios');
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  if (user.estado !== 'activo') {
    throw new AuthenticationError('El usuario se encuentra inactivo');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new AuthenticationError('Contraseña incorrecta');
  }

  await authRepository.updateLastAccess(user.id);

  const rol = user.roles?.nombre;
  const pais = user.paises || null;

  const token = generateAccessToken(user, rol, pais);
  const refreshToken = generateRefreshToken(user.id);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

  return {
    message: 'Inicio de sesión exitoso',
    token,
    refreshToken,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      username: user.username,
      rol,
      pais,
    },
  };
};

const register = async (payload) => {
  if (!payload.rol_id) {
    throw new AuthenticationError('Rol es obligatorio para el registro');
  }

  if (payload.email) {
    const existingEmail = await authRepository.findUserByEmail(payload.email);
    if (existingEmail) {
      throw new ConflictError('Ya existe un usuario con ese email');
    }
  }

  const newUser = await userService.createUser(payload);

  return {
    message: 'Usuario registrado correctamente',
    user: {
      id: newUser.id,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      email: newUser.email,
      username: newUser.username,
    },
  };
};

const refreshToken = async (token) => {
  if (!token) {
    throw new AuthenticationError('Refresh token no proporcionado');
  }

  const storedToken = await authRepository.findRefreshToken(token);

  if (!storedToken) {
    throw new AuthenticationError('Refresh token inválido');
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    await authRepository.deleteRefreshToken(token);
    throw new AuthenticationError('Refresh token expirado');
  }

  if (storedToken.usuarios.estado !== 'activo') {
    throw new AuthenticationError('El usuario se encuentra inactivo');
  }

  const user = storedToken.usuarios;
  const newToken = generateAccessToken(user, user.roles?.nombre, user.pais_id);

  return {
    message: 'Token renovado exitosamente',
    token: newToken,
  };
};

const logout = async (token) => {
  if (!token) {
    throw new AuthenticationError('Token no proporcionado');
  }

  await authRepository.deleteRefreshToken(token);

  return {
    message: 'Sesión cerrada exitosamente',
  };
};

const logoutAll = async (userId) => {
  await authRepository.deleteAllUserRefreshTokens(userId);

  return {
    message: 'Todas las sesiones han sido cerradas',
  };
};

const forgotPassword = async (identifier) => {
  if (!identifier) {
    throw new ValidationError('Usuario o correo es obligatorio');
  }

  const user = await authRepository.findUserSecurityQuestion(identifier);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  if (!user.pregunta_seguridad) {
    throw new ValidationError('Este usuario no tiene configurada una pregunta de seguridad');
  }

  return {
    message: 'Pregunta de seguridad encontrada',
    username: user.username,
    pregunta_seguridad: user.pregunta_seguridad,
  };
};

const resetPassword = async (username, respuesta_seguridad, nueva_password) => {
  if (!username || !respuesta_seguridad || !nueva_password) {
    throw new ValidationError('Usuario, respuesta de seguridad y nueva contraseña son obligatorios');
  }

  if (nueva_password.length < 6) {
    throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  if (!user.respuesta_seguridad_hash || !user.pregunta_seguridad) {
    throw new ValidationError('Este usuario no tiene configurada una pregunta de seguridad');
  }

  const isValidAnswer = await bcrypt.compare(respuesta_seguridad, user.respuesta_seguridad_hash);

  if (!isValidAnswer) {
    throw new AuthenticationError('Respuesta de seguridad incorrecta');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);
  await authRepository.updatePasswordWithTimestamp(user.id, password_hash);

  return { message: 'Contraseña restaurada exitosamente' };
};

const changePassword = async (userId, password_actual, nueva_password) => {
  if (!password_actual || !nueva_password) {
    throw new ValidationError('Contraseña actual y nueva contraseña son obligatorias');
  }

  if (nueva_password.length < 6) {
    throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
  }

  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const isValidPassword = await bcrypt.compare(password_actual, user.password_hash);

  if (!isValidPassword) {
    throw new AuthenticationError('Contraseña actual incorrecta');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);
  await authRepository.updatePasswordWithTimestamp(user.id, password_hash);

  return { message: 'Contraseña cambiada exitosamente' };
};

const updateSecurityQuestion = async (userId, pregunta_seguridad, respuesta_seguridad) => {
  if (!pregunta_seguridad || !respuesta_seguridad) {
    throw new ValidationError('Pregunta y respuesta de seguridad son obligatorias');
  }

  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const respuesta_seguridad_hash = bcrypt.hashSync(respuesta_seguridad, 10);
  await authRepository.updateSecurityQuestion(user.id, pregunta_seguridad, respuesta_seguridad_hash);

  return { message: 'Pregunta de seguridad actualizada exitosamente' };
};

const generateAccessToken = (user, rol, pais) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      rol,
      pais_id: user.pais_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
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
};
