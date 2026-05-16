const connectionLogRepository = require('../repositories/connectionLogRepository');

const logConnection = async ({ usuario_id, username, ip_address, jwt_token, user_agent }) => {
  let lugar = null;

  if (ip_address && ip_address !== '127.0.0.1' && ip_address !== '::1') {
    try {
      const cleanIp = ip_address.includes('::') ? ip_address.split(':').pop() : ip_address;
      const response = await fetch(`http://ip-api.com/json/${cleanIp}?fields=city,country,query&lang=es`, {
        signal: AbortSignal.timeout(3000),
      });
      const data = await response.json();
      if (data.city) {
        lugar = `${data.city}, ${data.country}`;
      }
    } catch {
      // Geolocalización no disponible
    }
  }

  return connectionLogRepository.create({
    usuario_id,
    username,
    ip_address,
    lugar,
    jwt_token,
    user_agent,
  });
};

const getLogs = async ({ limit = 50, offset = 0, username, usuario_id } = {}) => {
  return connectionLogRepository.findAll({ limit, offset, username, usuario_id });
};

const getLogById = async (id) => {
  return connectionLogRepository.findById(id);
};

const getSummary = async () => {
  return connectionLogRepository.getSummary();
};

const recordLogout = async ({ usuario_id, jwt_token }) => {
  return connectionLogRepository.setLogout({ usuario_id, jwt_token });
};

module.exports = {
  logConnection,
  getLogs,
  getLogById,
  getSummary,
  recordLogout,
};
