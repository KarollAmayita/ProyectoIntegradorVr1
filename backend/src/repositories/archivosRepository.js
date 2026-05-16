const supabase = require('../config/supabase');

const create = async (payload) => {
  const { data, error } = await supabase.from('archivos').insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const findAll = async ({ limit = 50, offset = 0, tipo, noticia_id, testimonio_id } = {}) => {
  let query = supabase.from('archivos').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (tipo) query = query.eq('tipo', tipo);
  if (noticia_id) query = query.eq('noticia_id', noticia_id);
  if (testimonio_id) query = query.eq('testimonio_id', testimonio_id);
  query = query.range(offset, offset + limit - 1);
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { data, count };
};

const findById = async (id) => {
  const { data, error } = await supabase.from('archivos').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const update = async (id, payload) => {
  payload.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('archivos').update(payload).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('archivos').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

module.exports = { create, findAll, findById, update, remove };
