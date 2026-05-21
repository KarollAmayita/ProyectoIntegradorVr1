const supabase = require('../../../../config/supabase');

class SupabaseArchivoRepository {
  async findAll({ limit = 50, offset = 0, tipo, noticia_id, testimonio_id, noticia_ids, testimonio_ids } = {}) {
    let query = supabase.from('archivos').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (tipo) query = query.eq('tipo', tipo);
    if (noticia_id) query = query.eq('noticia_id', noticia_id);
    if (testimonio_id) query = query.eq('testimonio_id', testimonio_id);
    if (noticia_ids || testimonio_ids) {
      const filters = [];
      if (noticia_ids?.length) filters.push(`noticia_id.in.(${noticia_ids.join(',')})`);
      if (testimonio_ids?.length) filters.push(`testimonio_id.in.(${testimonio_ids.join(',')})`);
      if (filters.length) query = query.or(filters.join(','));
    }
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, count };
  }

  async findById(id) {
    const { data, error } = await supabase.from('archivos').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(payload) {
    const { data, error } = await supabase.from('archivos').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id, payload) {
    payload.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('archivos').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id) {
    const { error } = await supabase.from('archivos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

module.exports = SupabaseArchivoRepository;
