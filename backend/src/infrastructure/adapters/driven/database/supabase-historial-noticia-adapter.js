const HistorialNoticiaPort = require('../../../../ports/news/outbound/historial-noticia-port');
const supabase = require('../../../../config/supabase');

class SupabaseHistorialNoticiaAdapter extends HistorialNoticiaPort {
  async registrarVersion({ noticia_id, usuario_id, titulo_anterior, contenido_anterior, estado_anterior, cambios }) {
    const { data, error } = await supabase
      .from('historial_noticias')
      .insert([{
        noticia_id,
        usuario_id,
        titulo_anterior,
        contenido_anterior,
        estado_anterior,
        cambios,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseHistorialNoticiaAdapter;
