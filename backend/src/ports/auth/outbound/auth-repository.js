class AuthRepository {
  async findUserByUsername(username) {
    throw new Error('Method not implemented');
  }
  async findUserByEmail(email) {
    throw new Error('Method not implemented');
  }
  async findUserById(id) {
    throw new Error('Method not implemented');
  }
  async findUserSecurityQuestion(identifier) {
    throw new Error('Method not implemented');
  }
  async updateLastAccess(userId) {
    throw new Error('Method not implemented');
  }
  async createRefreshToken(usuario_id, token, expires_at) {
    throw new Error('Method not implemented');
  }
  async findRefreshToken(token) {
    throw new Error('Method not implemented');
  }
  async deleteRefreshToken(token) {
    throw new Error('Method not implemented');
  }
  async deleteAllUserRefreshTokens(usuario_id) {
    throw new Error('Method not implemented');
  }
  async updatePasswordWithTimestamp(id, password_hash) {
    throw new Error('Method not implemented');
  }
  async updateSecurityQuestion(id, pregunta_seguridad, respuesta_seguridad_hash) {
    throw new Error('Method not implemented');
  }
}

module.exports = AuthRepository;
