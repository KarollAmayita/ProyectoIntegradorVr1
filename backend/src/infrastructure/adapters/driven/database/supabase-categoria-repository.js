const CategoriaRepository = require('../../../../ports/categoria/outbound/categoria-repository');
const supabase = require('../../../../config/supabase');

class SupabaseCategoriaRepository extends CategoriaRepository {
  async findAll() {
    const { data, error } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase.from('categorias').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async findBySlug(slug) {
    const { data, error } = await supabase.from('categorias').select('*').eq('slug', slug).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(payload) {
    const { data, error } = await supabase.from('categorias').insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id, payload) {
    const { data, error } = await supabase.from('categorias').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id) {
    const { error } = await supabase.from('categorias').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

module.exports = SupabaseCategoriaRepository;
