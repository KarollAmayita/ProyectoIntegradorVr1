const createListarEstadisticasPaisUseCase = (estadisticaPaisRepository) => {
  return async (pais_id, user) => {
    const finalPaisId = user?.rol !== 'superadmin' && user?.pais_id ? user.pais_id : pais_id;
    if (finalPaisId) return estadisticaPaisRepository.findByPaisId(finalPaisId);
    return estadisticaPaisRepository.findAll();
  };
};

module.exports = createListarEstadisticasPaisUseCase;
