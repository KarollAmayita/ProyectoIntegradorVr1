const NewsRepository = require('../../../../ports/news/outbound/news-repository');
const supabase = require('../../../../config/supabase');

class SupabaseNewsRepository extends NewsRepository {
  async findAllNews() {
    const { data, error } = await supabase
      .from('noticias')
      .select(`
        id,
        titulo,
        slug,
        resumen,
        contenido,
        imagen_principal_url,
        estado,
        fecha_publicacion,
        paises (
          id,
          nombre,
          codigo,
          slug
        ),
        usuarios (
          id,
          nombre,
          apellido,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findNewsByCountry(pais_id) {
    const { data, error } = await supabase
      .from('noticias')
      .select(`
        id,
        titulo,
        slug,
        resumen,
        contenido,
        imagen_principal_url,
        estado,
        fecha_publicacion,
        created_at,
        paises (
          id,
          nombre,
          codigo,
          slug
        ),
        usuarios (
          id,
          nombre,
          apellido,
          email
        )
      `)
      .eq('pais_id', pais_id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findPublishedNewsByCountrySlug(countrySlug) {
    const { data, error } = await supabase
      .from('noticias')
      .select(`
        id,
        titulo,
        slug,
        resumen,
        imagen_principal_url,
        fecha_publicacion,
        paises!inner (
          id,
          nombre,
          codigo,
          slug
        )
      `)
      .eq('estado', 'publicado')
      .eq('paises.slug', countrySlug)
      .order('fecha_publicacion', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findPublishedNewsDetailByCountryAndSlug(countrySlug, newsSlug) {
    const { data, error } = await supabase
      .from('noticias')
      .select(`
        id,
        titulo,
        slug,
        resumen,
        contenido,
        imagen_principal_url,
        fecha_publicacion,
        paises!inner (
          id,
          nombre,
          codigo,
          slug
        ),
        usuarios (
          id,
          nombre,
          apellido
        )
      `)
      .eq('estado', 'publicado')
      .eq('paises.slug', countrySlug)
      .eq('slug', newsSlug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async findNewsById(id) {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async createNews(newsData) {
    const { data, error } = await supabase
      .from('noticias')
      .insert([newsData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateNews(id, updateData) {
    const { data, error } = await supabase
      .from('noticias')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteNews(id) {
    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async findAllIdsByPais(pais_id) {
    const { data, error } = await supabase
      .from('noticias')
      .select('id')
      .eq('pais_id', pais_id);

    if (error) throw new Error(error.message);
    return data.map(n => n.id);
  }
}

module.exports = SupabaseNewsRepository;


