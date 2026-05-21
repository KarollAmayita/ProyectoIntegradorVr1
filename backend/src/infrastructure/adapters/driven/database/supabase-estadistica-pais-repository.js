const supabase = require('../../../../config/supabase');

class SupabaseEstadisticaPaisRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('estadisticas_pais')
      .select('*, paises(id, nombre, codigo, slug)')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('estadisticas_pais')
      .select('*, paises(id, nombre, codigo, slug)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async findByPaisId(paisId) {
    const { data, error } = await supabase
      .from('estadisticas_pais')
      .select('*')
      .eq('pais_id', paisId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async create(payload) {
    const { data, error } = await supabase.from('estadisticas_pais').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id, payload) {
    const { data, error } = await supabase.from('estadisticas_pais').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id) {
    const { error } = await supabase.from('estadisticas_pais').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

module.exports = SupabaseEstadisticaPaisRepository;
