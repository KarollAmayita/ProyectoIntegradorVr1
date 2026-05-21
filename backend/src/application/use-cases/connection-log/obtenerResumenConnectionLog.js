const createObtenerResumenConnectionLogUseCase = (connectionLogRepository) => {
  return async () => {
    return connectionLogRepository.getSummary();
  };
};

module.exports = createObtenerResumenConnectionLogUseCase;
