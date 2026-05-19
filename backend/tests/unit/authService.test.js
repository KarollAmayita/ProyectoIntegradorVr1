const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret-key';

jest.mock('../../src/config/supabase', () => require('../mocks/supabase'));

const authService = require('../../src/services/authService');
const authRepository = require('../../src/repositories/authRepository');

const mockUser = {
  id: 1,
  nombre: 'Super',
  apellido: 'Admin',
  email: 'admin@test.com',
  username: 'superadmin',
  password_hash: bcrypt.hashSync('123456', 10),
  estado: 'activo',
  pais_id: null,
  pregunta_seguridad: '¿Test?',
  respuesta_seguridad_hash: bcrypt.hashSync('respuesta', 10),
  roles: { id: 1, nombre: 'superadmin' },
  paises: null,
};

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw AuthenticationError if missing credentials', async () => {
      await expect(authService.login({})).rejects.toThrow('El usuario y la contraseña son obligatorios');
    });

    it('should throw NotFoundError if user not found', async () => {
      authRepository.findUserByUsername = jest.fn().mockResolvedValue(null);
      await expect(authService.login({ username: 'nadie', password: '123456' })).rejects.toThrow('Usuario no encontrado');
    });

    it('should throw AuthenticationError if inactive', async () => {
      authRepository.findUserByUsername = jest.fn().mockResolvedValue({ ...mockUser, estado: 'inactivo' });
      await expect(authService.login({ username: 'superadmin', password: '123456' })).rejects.toThrow('inactivo');
    });

    it('should throw AuthenticationError if wrong password', async () => {
      authRepository.findUserByUsername = jest.fn().mockResolvedValue(mockUser);
      await expect(authService.login({ username: 'superadmin', password: 'wrong' })).rejects.toThrow('Contraseña incorrecta');
    });

    it('should return token + user on success', async () => {
      authRepository.findUserByUsername = jest.fn().mockResolvedValue(mockUser);
      authRepository.updateLastAccess = jest.fn().mockResolvedValue();
      authRepository.createRefreshToken = jest.fn().mockResolvedValue({ token: 'rt' });

      const result = await authService.login({ username: 'superadmin', password: '123456' });
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.username).toBe('superadmin');
    });
  });

  describe('changePassword', () => {
    it('should throw if passwords too short', async () => {
      await expect(authService.changePassword(1, '123456', 'abc')).rejects.toThrow('al menos 6');
    });

    it('should throw if current password wrong', async () => {
      authRepository.findUserById = jest.fn().mockResolvedValue({
        ...mockUser,
        password_hash: bcrypt.hashSync('realpass', 10),
      });
      await expect(authService.changePassword(1, 'wrongpass', 'nueva123')).rejects.toThrow('Contraseña actual incorrecta');
    });

    it('should change password successfully', async () => {
      authRepository.findUserById = jest.fn().mockResolvedValue(mockUser);
      authRepository.updatePasswordWithTimestamp = jest.fn().mockResolvedValue({ id: 1 });
      const result = await authService.changePassword(1, '123456', 'nueva123');
      expect(result.message).toContain('exitosa');
    });
  });

  describe('refreshToken', () => {
    it('should throw if no token provided', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('Refresh token no proporcionado');
    });

    it('should throw if token not found in DB', async () => {
      authRepository.findRefreshToken = jest.fn().mockResolvedValue(null);
      await expect(authService.refreshToken('invalid-token')).rejects.toThrow('Refresh token inválido');
    });

    it('should delete expired token and throw', async () => {
      authRepository.findRefreshToken = jest.fn().mockResolvedValue({
        token: 'expired-token',
        expires_at: new Date(Date.now() - 1000).toISOString(),
        usuarios: { id: 1, estado: 'activo', roles: { nombre: 'superadmin' } },
      });
      authRepository.deleteRefreshToken = jest.fn().mockResolvedValue();
      await expect(authService.refreshToken('expired-token')).rejects.toThrow('Refresh token expirado');
      expect(authRepository.deleteRefreshToken).toHaveBeenCalledWith('expired-token');
    });

    it('should rotate token on success', async () => {
      const future = new Date(Date.now() + 86400000).toISOString();
      authRepository.findRefreshToken = jest.fn().mockResolvedValue({
        token: 'valid-rt',
        expires_at: future,
        usuarios: { id: 1, estado: 'activo', nombre: 'Super', apellido: 'Admin', username: 'superadmin', email: 'admin@test.com', pais_id: null, roles: { nombre: 'superadmin' } },
      });
      authRepository.deleteRefreshToken = jest.fn().mockResolvedValue();
      authRepository.createRefreshToken = jest.fn().mockResolvedValue({ token: 'new-rt' });

      const result = await authService.refreshToken('valid-rt');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.refreshToken).not.toBe('valid-rt');
      expect(authRepository.deleteRefreshToken).toHaveBeenCalledWith('valid-rt');
      expect(authRepository.createRefreshToken).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw if security answer is wrong', async () => {
      authRepository.findUserByUsername = jest.fn().mockResolvedValue(mockUser);
      await expect(authService.resetPassword('superadmin', 'wrong', 'nueva123')).rejects.toThrow('Respuesta de seguridad incorrecta');
    });

    it('should reset password with correct answer', async () => {
      authRepository.findUserByUsername = jest.fn().mockResolvedValue(mockUser);
      authRepository.updatePasswordWithTimestamp = jest.fn().mockResolvedValue({ id: 1 });
      const result = await authService.resetPassword('superadmin', 'respuesta', 'nueva123456');
      expect(result.message).toContain('restaurada');
    });
  });
});
