const createActualizarEstadisticaPaisUseCase = (estadisticaPaisRepository) => {
  return async (id, payload) => {
    const existing = await estadisticaPaisRepository.findById(id);
    if (!existing) throw new Error('Estadística no encontrada');
    const allowed = ['indicador', 'valor', 'unidad', 'periodo'];
    const updatePayload = { updated_at: new Date().toISOString() };
    allowed.forEach(f => { if (payload[f] !== undefined) updatePayload[f] = payload[f]; });
    return estadisticaPaisRepository.update(id, updatePayload);
  };
};

module.exports = createActualizarEstadisticaPaisUseCase;
