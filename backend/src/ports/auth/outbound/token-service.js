class TokenService {
  async generateAccessToken(user) {
    throw new Error('Method not implemented');
  }
  async generateRefreshToken(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = TokenService;
