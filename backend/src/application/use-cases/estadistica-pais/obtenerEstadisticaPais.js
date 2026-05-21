const createObtenerEstadisticaPaisUseCase = (estadisticaPaisRepository) => {
  return async (id) => {
    const item = await estadisticaPaisRepository.findById(id);
    if (!item) throw new Error('Estadística no encontrada');
    return item;
  };
};

module.exports = createObtenerEstadisticaPaisUseCase;
