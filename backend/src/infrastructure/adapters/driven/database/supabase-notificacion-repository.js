const supabase = require('../../../../config/supabase');

class SupabaseNotificacionRepository {
  async findByUsuarioId(usuarioId, { limit = 50, offset = 0, soloNoLeidas = false } = {}) {
    let query = supabase.from('notificaciones').select('*', { count: 'exact' }).eq('usuario_id', usuarioId).order('created_at', { ascending: false });
    if (soloNoLeidas) query = query.eq('leida', false);
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, count };
  }

  async findById(id) {
    const { data, error } = await supabase.from('notificaciones').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(payload) {
    const { data, error } = await supabase.from('notificaciones').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async marcarLeida(id) {
    const { data, error } = await supabase.from('notificaciones').update({ leida: true }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async marcarTodasLeidas(usuarioId) {
    const { error } = await supabase.from('notificaciones').update({ leida: true }).eq('usuario_id', usuarioId).eq('leida', false);
    if (error) throw new Error(error.message);
  }

  async countNoLeidas(usuarioId) {
    const { count, error } = await supabase.from('notificaciones').select('*', { count: 'exact', head: true }).eq('usuario_id', usuarioId).eq('leida', false);
    if (error) throw new Error(error.message);
    return count;
  }
}

module.exports = SupabaseNotificacionRepository;
