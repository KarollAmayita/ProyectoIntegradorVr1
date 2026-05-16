const supabase = require('../config/supabase');

const findAll = async () => {
  const { data, error } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase.from('categorias').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const findBySlug = async (slug) => {
  const { data, error } = await supabase.from('categorias').select('*').eq('slug', slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const create = async (payload) => {
  const { data, error } = await supabase.from('categorias').insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const update = async (id, payload) => {
  const { data, error } = await supabase.from('categorias').update(payload).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const remove = async (id) => {
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

const findCategoriasByNoticiaId = async (noticiaId) => {
  const { data, error } = await supabase
    .from('noticia_categorias')
    .select('categoria_id, categorias(*)')
    .eq('noticia_id', noticiaId);
  if (error) throw new Error(error.message);
  return data.map(r => r.categorias);
};

module.exports = { findAll, findById, findBySlug, create, update, remove, findCategoriasByNoticiaId };
