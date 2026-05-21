const TokenService = require('../../../../ports/auth/outbound/token-service');
const jwt = require('jsonwebtoken');

class JwtTokenService extends TokenService {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  async generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        rol: user.roleName,
        pais_id: user.pais_id,
      },
      this.secret,
      { expiresIn: '2h' }
    );
  }

  async generateRefreshToken(userId) {
    return jwt.sign(
      { id: userId, type: 'refresh' },
      this.secret,
      { expiresIn: '7d' }
    );
  }
}

module.exports = JwtTokenService;
