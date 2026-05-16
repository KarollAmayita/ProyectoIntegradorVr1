const supabase = require('../config/supabase');

const create = async (payload) => {
  const { data, error } = await supabase.from('historial_noticias').insert([{
    noticia_id: payload.noticia_id,
    usuario_id: payload.usuario_id,
    titulo_anterior: payload.titulo_anterior,
    contenido_anterior: payload.contenido_anterior,
    estado_anterior: payload.estado_anterior,
    cambios: payload.cambios,
  }]).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const findByNoticiaId = async (noticiaId) => {
  const { data, error } = await supabase
    .from('historial_noticias')
    .select('*, usuarios(id, nombre, apellido, email)')
    .eq('noticia_id', noticiaId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const findById = async (id) => {
  const { data, error } = await supabase
    .from('historial_noticias')
    .select('*, usuarios(id, nombre, apellido, email)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

module.exports = { create, findByNoticiaId, findById };
