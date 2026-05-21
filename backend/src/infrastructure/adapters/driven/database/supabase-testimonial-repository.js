const TestimonialRepository = require('../../../../ports/testimonial/outbound/testimonial-repository');
const supabase = require('../../../../config/supabase');

class SupabaseTestimonialRepository extends TestimonialRepository {
  async findAllTestimonials() {
    const { data, error } = await supabase
      .from('testimonios')
      .select(`
        id,
        nombre,
        cargo,
        empresa,
        contenido,
        foto_url,
        instagram_url,
        facebook_url,
        estado,
        destacado,
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
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findTestimonialsByCountry(pais_id) {
    const { data, error } = await supabase
      .from('testimonios')
      .select(`
        id,
        nombre,
        cargo,
        empresa,
        contenido,
        foto_url,
        instagram_url,
        facebook_url,
        estado,
        destacado,
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

  async findPublishedTestimonialsByCountrySlug(countrySlug) {
    const { data, error } = await supabase
      .from('testimonios')
      .select(`
        id,
        nombre,
        cargo,
        empresa,
        contenido,
        foto_url,
        instagram_url,
        facebook_url,
        destacado,
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
      .order('destacado', { ascending: false })
      .order('fecha_publicacion', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async createTestimonial(testimonialData) {
    const { data, error } = await supabase
      .from('testimonios')
      .insert([testimonialData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findTestimonialById(id) {
    const { data, error } = await supabase
      .from('testimonios')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateTestimonial(id, updateData) {
    const { data, error } = await supabase
      .from('testimonios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteTestimonial(id) {
    const { error } = await supabase
      .from('testimonios')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async findAllIdsByPais(pais_id) {
    const { data, error } = await supabase
      .from('testimonios')
      .select('id')
      .eq('pais_id', pais_id);

    if (error) throw new Error(error.message);
    return data.map(t => t.id);
  }
}

module.exports = SupabaseTestimonialRepository;
