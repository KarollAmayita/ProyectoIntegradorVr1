class ConnectionLogger {
  async logConnection({ usuario_id, username, ip_address, jwt_token, user_agent }) {
    throw new Error('Method not implemented');
  }
  async recordLogout({ usuario_id, jwt_token }) {
    throw new Error('Method not implemented');
  }
}

module.exports = ConnectionLogger;
