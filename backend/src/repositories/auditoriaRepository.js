const supabase = require('../config/supabase');

const create = async ({ usuario_id, username, accion, modulo, detalle, ip_address }) => {
  const { data, error } = await supabase
    .from('auditoria')
    .insert([{ usuario_id, username, accion, modulo, detalle: detalle ? JSON.stringify(detalle) : null, ip_address }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const findAll = async ({ limit = 50, offset = 0, modulo, usuario_id } = {}) => {
  let query = supabase
    .from('auditoria')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (modulo) query = query.eq('modulo', modulo);
  if (usuario_id) query = query.eq('usuario_id', usuario_id);

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { data, count };
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('auditoria')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { create, findAll, findById };
