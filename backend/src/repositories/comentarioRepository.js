const supabase = require('../config/supabase');

const findAll = async ({ limit = 50, offset = 0, estado, noticia_id } = {}) => {
  let query = supabase.from('comentarios').select('*, noticias(id, titulo)', { count: 'exact' }).order('created_at', { ascending: false });
  if (estado) query = query.eq('estado', estado);
  if (noticia_id) query = query.eq('noticia_id', noticia_id);
  query = query.range(offset, offset + limit - 1);
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { data, count };
};

const findById = async (id) => {
  const { data, error } = await supabase.from('comentarios').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const findByNoticiaId = async (noticiaId, { limit = 50, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('comentarios')
    .select('*', { count: 'exact' })
    .eq('noticia_id', noticiaId)
    .eq('estado', 'aprobado')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return { data, count };
};

const create = async (payload) => {
  const { data, error } = await supabase.from('comentarios').insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const updateEstado = async (id, estado) => {
  const { data, error } = await supabase.from('comentarios').update({ estado }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('comentarios').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

module.exports = { findAll, findById, findByNoticiaId, create, updateEstado, remove };
