const supabase = require('../../../../config/supabase');

class SupabaseConnectionLogRepository {
  async findAll({ limit, offset, username, usuario_id, usuario_ids } = {}) {
    let query = supabase
      .from('historial_conexiones')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (username) query = query.eq('username', username);
    if (usuario_id) query = query.eq('usuario_id', usuario_id);
    if (usuario_ids) query = query.in('usuario_id', usuario_ids);

    if (limit) query = query.range(offset || 0, (offset || 0) + limit - 1);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);
    return { data, count };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('historial_conexiones')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalResult, todayResult, lastResult] = await Promise.all([
      supabase.from('historial_conexiones').select('*', { count: 'exact', head: true }),
      supabase.from('historial_conexiones').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('historial_conexiones').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    if (totalResult.error) throw new Error(totalResult.error.message);

    return {
      total: totalResult.count,
      total_hoy: todayResult.count,
      ultimas: lastResult.data || [],
    };
  }

  async create({ usuario_id, username, ip_address, lugar, jwt_token, user_agent }) {
    const { data, error } = await supabase
      .from('historial_conexiones')
      .insert([{ usuario_id, username, ip_address, lugar, jwt_token, user_agent }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async setLogout({ usuario_id, jwt_token }) {
    const { data, error } = await supabase
      .from('historial_conexiones')
      .update({ logout_at: new Date().toISOString(), jwt_token })
      .eq('usuario_id', usuario_id)
      .is('logout_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseConnectionLogRepository;
