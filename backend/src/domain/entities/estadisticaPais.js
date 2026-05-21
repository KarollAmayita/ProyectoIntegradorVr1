const createEstadisticaPais = ({
  id,
  pais_id,
  indicador,
  valor,
  unidad = null,
  periodo = null,
  created_at,
  updated_at,
  paises = null
} = {}) => ({
  id,
  pais_id,
  indicador,
  valor,
  unidad,
  periodo,
  created_at,
  updated_at,
  paises
});

module.exports = createEstadisticaPais;
