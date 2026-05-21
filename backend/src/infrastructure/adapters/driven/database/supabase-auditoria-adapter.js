const AuditoriaPort = require('../../../../ports/auditoria/outbound/auditoria-port');
const supabase = require('../../../../config/supabase');

class SupabaseAuditoriaAdapter extends AuditoriaPort {
  async registrar({ usuario_id, username, accion, modulo, detalle, ip_address }) {
    const { data, error } = await supabase
      .from('auditoria')
      .insert([{ usuario_id, username, accion, modulo, detalle: detalle ? JSON.stringify(detalle) : null, ip_address }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async listar({ limit = 50, offset = 0, modulo, usuario_id, usuario_ids } = {}) {
    let query = supabase
      .from('auditoria')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (modulo) query = query.eq('modulo', modulo);
    if (usuario_id) query = query.eq('usuario_id', usuario_id);
    if (usuario_ids) query = query.in('usuario_id', usuario_ids);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);
    return { data, count };
  }

  async obtener(id) {
    const { data, error } = await supabase
      .from('auditoria')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseAuditoriaAdapter;
