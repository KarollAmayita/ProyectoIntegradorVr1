const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const userService = require('./userService');

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new Error('El usuario y la contraseña son obligatorios');
  }

  const user = await authRepository.findUserByUsername(username);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (user.estado !== 'activo') {
    throw new Error('El usuario se encuentra inactivo');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Contraseña incorrecta');
  }

  await authRepository.updateLastAccess(user.id);

  const rol = user.roles?.nombre;
  const pais = user.paises || null;

  const token = jwt.sign(
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

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await authRepository.createRefreshToken(user.id, refreshToken, expires_at);

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
    throw new Error('Rol es obligatorio para el registro');
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
    throw new Error('Refresh token no proporcionado');
  }

  const storedToken = await authRepository.findRefreshToken(token);

  if (!storedToken) {
    throw new Error('Refresh token inválido');
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    await authRepository.deleteRefreshToken(token);
    throw new Error('Refresh token expirado');
  }

  if (storedToken.usuarios.estado !== 'activo') {
    throw new Error('El usuario se encuentra inactivo');
  }

  const user = storedToken.usuarios;

  const newToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.roles?.nombre,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    message: 'Token renovado exitosamente',
    token: newToken,
  };
};

const logout = async (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
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

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  logoutAll,
};