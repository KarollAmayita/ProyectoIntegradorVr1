const supabase = require('../config/supabase');

const findAll = async () => {
  const { data, error } = await supabase
    .from('estadisticas_pais')
    .select('*, paises(id, nombre, codigo, slug)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('estadisticas_pais')
    .select('*, paises(id, nombre, codigo, slug)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const findByPaisId = async (paisId) => {
  const { data, error } = await supabase
    .from('estadisticas_pais')
    .select('*')
    .eq('pais_id', paisId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const findByIndicador = async (paisId, indicador) => {
  const { data, error } = await supabase
    .from('estadisticas_pais')
    .select('*')
    .eq('pais_id', paisId)
    .eq('indicador', indicador)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const create = async (payload) => {
  const { data, error } = await supabase.from('estadisticas_pais').insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const update = async (id, payload) => {
  const { data, error } = await supabase.from('estadisticas_pais').update(payload).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('estadisticas_pais').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

module.exports = { findAll, findById, findByPaisId, findByIndicador, create, update, remove };
