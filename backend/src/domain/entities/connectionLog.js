const createConnectionLog = ({
  id,
  usuario_id,
  username,
  ip_address,
  lugar,
  jwt_token,
  user_agent,
  login_at,
  logout_at,
  created_at,
} = {}) => ({
  id,
  usuario_id,
  username,
  ip_address,
  lugar,
  jwt_token,
  user_agent,
  login_at,
  logout_at,
  created_at,
});

module.exports = createConnectionLog;
