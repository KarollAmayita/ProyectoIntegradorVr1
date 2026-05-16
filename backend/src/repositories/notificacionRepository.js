const supabase = require('../config/supabase');

const create = async ({ usuario_id, titulo, mensaje, tipo }) => {
  const { data, error } = await supabase.from('notificaciones').insert([{ usuario_id, titulo, mensaje, tipo }]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const findByUsuarioId = async (usuarioId, { limit = 50, offset = 0, soloNoLeidas = false } = {}) => {
  let query = supabase.from('notificaciones').select('*', { count: 'exact' }).eq('usuario_id', usuarioId).order('created_at', { ascending: false });
  if (soloNoLeidas) query = query.eq('leida', false);
  query = query.range(offset, offset + limit - 1);
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { data, count };
};

const marcarLeida = async (id) => {
  const { data, error } = await supabase.from('notificaciones').update({ leida: true }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const marcarTodasLeidas = async (usuarioId) => {
  const { error } = await supabase.from('notificaciones').update({ leida: true }).eq('usuario_id', usuarioId).eq('leida', false);
  if (error) throw new Error(error.message);
};

const countNoLeidas = async (usuarioId) => {
  const { count, error } = await supabase.from('notificaciones').select('*', { count: 'exact', head: true }).eq('usuario_id', usuarioId).eq('leida', false);
  if (error) throw new Error(error.message);
  return count;
};

module.exports = { create, findByUsuarioId, marcarLeida, marcarTodasLeidas, countNoLeidas };
