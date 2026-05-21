const createEliminarEstadisticaPaisUseCase = (estadisticaPaisRepository) => {
  return async (id) => {
    const existing = await estadisticaPaisRepository.findById(id);
    if (!existing) throw new Error('Estadística no encontrada');
    await estadisticaPaisRepository.remove(id);
    return { message: 'Estadística eliminada correctamente' };
  };
};

module.exports = createEliminarEstadisticaPaisUseCase;
