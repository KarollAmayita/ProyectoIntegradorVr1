const createObtenerConnectionLogUseCase = (connectionLogRepository) => {
  return async (id) => {
    const log = await connectionLogRepository.findById(id);
    if (!log) throw new Error('Registro no encontrado');
    return log;
  };
};

module.exports = createObtenerConnectionLogUseCase;
