const supabase = require('../../../../config/supabase');

class SupabaseHistorialNoticiaRepository {
  async findByNoticiaId(noticiaId) {
    const { data, error } = await supabase
      .from('historial_noticias')
      .select('*, usuarios(id, nombre, apellido, email)')
      .eq('noticia_id', noticiaId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('historial_noticias')
      .select('*, usuarios(id, nombre, apellido, email)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseHistorialNoticiaRepository;
