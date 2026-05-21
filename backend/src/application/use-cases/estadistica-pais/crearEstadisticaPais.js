const createCrearEstadisticaPaisUseCase = (estadisticaPaisRepository) => {
  return async ({ pais_id, indicador, valor, unidad, periodo }) => {
    if (!pais_id || !indicador || !valor) {
      throw new Error('País, indicador y valor son obligatorios');
    }
    return estadisticaPaisRepository.create({ pais_id, indicador, valor, unidad: unidad || null, periodo: periodo || null });
  };
};

module.exports = createCrearEstadisticaPaisUseCase;
