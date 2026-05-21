const ContactRequestRepository = require('../../../../ports/contact-request/outbound/contact-request-repository');
const supabase = require('../../../../config/supabase');

class SupabaseContactRequestRepository extends ContactRequestRepository {
  async findAllRequests() {
    const { data, error } = await supabase
      .from('solicitudes_contacto')
      .select(`
        id,
        nombre,
        correo,
        telefono,
        finalidad,
        mensaje,
        estado,
        observaciones_admin,
        fecha_gestion,
        created_at,
        updated_at,
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

  async findRequestsByCountry(pais_id) {
    const { data, error } = await supabase
      .from('solicitudes_contacto')
      .select(`
        id,
        nombre,
        correo,
        telefono,
        finalidad,
        mensaje,
        estado,
        observaciones_admin,
        fecha_gestion,
        created_at,
        updated_at,
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

  async findRequestById(id) {
    const { data, error } = await supabase
      .from('solicitudes_contacto')
      .select(`
        id,
        pais_id,
        nombre,
        correo,
        telefono,
        finalidad,
        mensaje,
        estado,
        observaciones_admin,
        fecha_gestion,
        gestionado_por,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async createRequest(payload) {
    const { data, error } = await supabase
      .from('solicitudes_contacto')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateRequest(id, payload) {
    const { data, error } = await supabase
      .from('solicitudes_contacto')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteRequest(id) {
    const { error } = await supabase
      .from('solicitudes_contacto')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

module.exports = SupabaseContactRequestRepository;
