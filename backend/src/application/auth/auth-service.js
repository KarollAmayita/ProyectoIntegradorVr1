const User = require('../../domain/auth/user');
const { AuthenticationError, ConflictError, NotFoundError, ValidationError } = require('../../utils/errors');

class AuthService {
  constructor({
    authRepository,
    tokenService,
    passwordHasher,
    connectionLogger,
    userService // This is another application service
  }) {
    this.authRepository = authRepository;
    this.tokenService = tokenService;
    this.passwordHasher = passwordHasher;
    this.connectionLogger = connectionLogger;
    this.userService = userService;
  }

  async login({ username, password, ipAddress, userAgent }) {
    if (!username || !password) {
      throw new AuthenticationError('El usuario y la contraseña son obligatorios');
    }

    const userData = await this.authRepository.findUserByUsername(username);

    if (!userData) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const user = new User(userData);

    if (!user.isActive) {
      throw new AuthenticationError('El usuario se encuentra inactivo');
    }

    const isValidPassword = await this.passwordHasher.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new AuthenticationError('Contraseña incorrecta');
    }

    await this.authRepository.updateLastAccess(user.id);

    const token = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await this.authRepository.createRefreshToken(user.id, refreshToken, expiresAt);

    this.connectionLogger.logConnection({
      usuario_id: user.id,
      username: user.username,
      ip_address: ipAddress || null,
      jwt_token: token,
      user_agent: userAgent || null,
    }).catch(() => {});

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
        rol: user.roleName,
        pais: user.paises || { nombre: user.countryName, codigo: null },
      },
    };
  }

  async register(payload) {
    if (!payload.rol_id) {
      throw new AuthenticationError('Rol es obligatorio para el registro');
    }

    if (payload.email) {
      const existingEmail = await this.authRepository.findUserByEmail(payload.email);
      if (existingEmail) {
        throw new ConflictError('Ya existe un usuario con ese email');
      }
    }

    const newUserData = await this.userService.createUser(payload);
    const newUser = new User(newUserData);

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
  }

  async refreshToken(token) {
    if (!token) {
      throw new AuthenticationError('Refresh token no proporcionado');
    }

    const storedToken = await this.authRepository.findRefreshToken(token);

    if (!storedToken) {
      throw new AuthenticationError('Refresh token inválido');
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      await this.authRepository.deleteRefreshToken(token);
      throw new AuthenticationError('Refresh token expirado');
    }

    const user = new User(storedToken.usuarios);

    if (!user.isActive) {
      await this.authRepository.deleteRefreshToken(token);
      throw new AuthenticationError('El usuario se encuentra inactivo');
    }

    await this.authRepository.deleteRefreshToken(token);

    const newAccessToken = await this.tokenService.generateAccessToken(user);
    const newRefreshToken = await this.tokenService.generateRefreshToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await this.authRepository.createRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
      message: 'Token renovado exitosamente',
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken, userId, accessToken) {
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token no proporcionado');
    }

    await this.authRepository.deleteRefreshToken(refreshToken);

    if (userId && accessToken) {
      this.connectionLogger.recordLogout({ usuario_id: userId, jwt_token: accessToken }).catch(() => {});
    }

    return {
      message: 'Sesión cerrada exitosamente',
    };
  }

  async logoutAll(userId, accessToken) {
    await this.authRepository.deleteAllUserRefreshTokens(userId);

    if (userId && accessToken) {
      this.connectionLogger.recordLogout({ usuario_id: userId, jwt_token: accessToken }).catch(() => {});
    }

    return {
      message: 'Todas las sesiones han sido cerradas',
    };
  }

  async forgotPassword(identifier) {
    if (!identifier) {
      throw new ValidationError('Usuario o correo es obligatorio');
    }

    const userData = await this.authRepository.findUserSecurityQuestion(identifier);

    if (!userData) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const user = new User(userData);

    if (!user.pregunta_seguridad) {
      throw new ValidationError('Este usuario no tiene configurada una pregunta de seguridad');
    }

    return {
      message: 'Pregunta de seguridad encontrada',
      username: user.username,
      pregunta_seguridad: user.pregunta_seguridad,
    };
  }

  async resetPassword(username, respuesta_seguridad, nueva_password) {
    if (!username || !respuesta_seguridad || !nueva_password) {
      throw new ValidationError('Usuario, respuesta de seguridad y nueva contraseña son obligatorios');
    }

    if (nueva_password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
    }

    const userData = await this.authRepository.findUserByUsername(username);

    if (!userData) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const user = new User(userData);

    if (!user.respuesta_seguridad_hash || !user.pregunta_seguridad) {
      throw new ValidationError('Este usuario no tiene configurada una pregunta de seguridad');
    }

    const isValidAnswer = await this.passwordHasher.compare(respuesta_seguridad, user.respuesta_seguridad_hash);

    if (!isValidAnswer) {
      throw new AuthenticationError('Respuesta de seguridad incorrecta');
    }

    const password_hash = await this.passwordHasher.hash(nueva_password);
    await this.authRepository.updatePasswordWithTimestamp(user.id, password_hash);

    return { message: 'Contraseña restaurada exitosamente' };
  }

  async changePassword(userId, password_actual, nueva_password) {
    if (!password_actual || !nueva_password) {
      throw new ValidationError('Contraseña actual y nueva contraseña son obligatorias');
    }

    if (nueva_password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
    }

    const userData = await this.authRepository.findUserById(userId);

    if (!userData) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const user = new User(userData);

    const isValidPassword = await this.passwordHasher.compare(password_actual, user.password_hash);

    if (!isValidPassword) {
      throw new AuthenticationError('Contraseña actual incorrecta');
    }

    const password_hash = await this.passwordHasher.hash(nueva_password);
    await this.authRepository.updatePasswordWithTimestamp(user.id, password_hash);

    return { message: 'Contraseña cambiada exitosamente' };
  }

  async updateSecurityQuestion(userId, pregunta_seguridad, respuesta_seguridad) {
    if (!pregunta_seguridad || !respuesta_seguridad) {
      throw new ValidationError('Pregunta y respuesta de seguridad son obligatorias');
    }

    const userData = await this.authRepository.findUserById(userId);

    if (!userData) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const user = new User(userData);
    const respuesta_seguridad_hash = await this.passwordHasher.hash(respuesta_seguridad);
    await this.authRepository.updateSecurityQuestion(user.id, pregunta_seguridad, respuesta_seguridad_hash);

    return { message: 'Pregunta de seguridad actualizada exitosamente' };
  }

  async getMyProfile(userId) {
    const userData = await this.authRepository.findUserById(userId);
    if (!userData) throw new NotFoundError('Usuario no encontrado');
    const user = new User(userData);

    return {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      username: user.username,
      estado: user.estado,
      pais_id: user.pais_id,
      rol: user.roleName,
      pais: user.countryName,
      pregunta_seguridad: user.pregunta_seguridad,
    };
  }

  async getMySecurityQuestion(userId) {
    const userData = await this.authRepository.findUserById(userId);
    if (!userData) throw new NotFoundError('Usuario no encontrado');
    const user = new User(userData);
    return {
      pregunta_seguridad: user.pregunta_seguridad || null,
    };
  }

  async getPublicSecurityQuestion(identifier) {
    if (!identifier) throw new ValidationError('Usuario o correo es obligatorio');
    const userData = await this.authRepository.findUserSecurityQuestion(identifier);
    if (!userData) throw new NotFoundError('Usuario no encontrado');
    const user = new User(userData);
    if (!user.pregunta_seguridad) throw new ValidationError('Este usuario no tiene configurada una pregunta de seguridad');
    return {
      username: user.username,
      pregunta_seguridad: user.pregunta_seguridad,
    };
  }

  async endSession(refreshToken) {
    const stored = await this.authRepository.findRefreshToken(refreshToken).catch(() => null);
    if (!stored) return;
    await this.authRepository.deleteRefreshToken(refreshToken);
    if (stored.usuario_id) {
      this.connectionLogger.recordLogout({ usuario_id: stored.usuario_id, jwt_token: null }).catch(() => {});
    }
  }
}

module.exports = AuthService;
