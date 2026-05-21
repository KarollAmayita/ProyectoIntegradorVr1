const createListarConnectionLogsUseCase = (connectionLogRepository, userRepository) => {
  return async ({ limit, offset, username, usuario_id, user } = {}) => {
    let usuario_ids;

    if (user && user.rol === 'admin_pais' && user.pais_id) {
      const usuarios = await userRepository.findUsersByCountry(user.pais_id);
      usuario_ids = usuarios?.map(u => u.id) || [];
      if (usuario_ids.length === 0) return { data: [], count: 0 };
    }

    return connectionLogRepository.findAll({ limit, offset, username, usuario_id, usuario_ids });
  };
};

module.exports = createListarConnectionLogsUseCase;
