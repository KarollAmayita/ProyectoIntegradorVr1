const estadisticaPaisRepository = require('../repositories/estadisticaPaisRepository');

const listar = async (pais_id) => {
  if (pais_id) return estadisticaPaisRepository.findByPaisId(pais_id);
  return estadisticaPaisRepository.findAll();
};

const obtener = async (id) => {
  const item = await estadisticaPaisRepository.findById(id);
  if (!item) throw new Error('Estadística no encontrada');
  return item;
};

const crear = async ({ pais_id, indicador, valor, unidad, periodo }) => {
  if (!pais_id || !indicador || !valor) throw new Error('País, indicador y valor son obligatorios');
  return estadisticaPaisRepository.create({ pais_id, indicador, valor, unidad: unidad || null, periodo: periodo || null });
};

const actualizar = async (id, payload) => {
  const existing = await estadisticaPaisRepository.findById(id);
  if (!existing) throw new Error('Estadística no encontrada');
  const allowed = ['indicador', 'valor', 'unidad', 'periodo'];
  const updatePayload = { updated_at: new Date().toISOString() };
  allowed.forEach(f => { if (payload[f] !== undefined) updatePayload[f] = payload[f]; });
  return estadisticaPaisRepository.update(id, updatePayload);
};

const eliminar = async (id) => {
  const existing = await estadisticaPaisRepository.findById(id);
  if (!existing) throw new Error('Estadística no encontrada');
  await estadisticaPaisRepository.remove(id);
  return { message: 'Estadística eliminada correctamente' };
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
