const UserRepository = require('../../../../ports/user/outbound/user-repository');
const supabase = require('../../../../config/supabase');

class SupabaseUserRepository extends UserRepository {
  async findAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        apellido,
        email,
        username,
        estado,
        created_at,
        roles (
          id,
          nombre
        ),
        paises (
          id,
          nombre,
          codigo,
          slug
        )
      `)
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findUsersByCountry(pais_id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        apellido,
        email,
        username,
        estado,
        created_at,
        roles (
          id,
          nombre
        ),
        paises (
          id,
          nombre,
          codigo,
          slug
        )
      `)
      .eq('pais_id', pais_id)
      .order('id', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async findUserByUsernameOrEmail(username, email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, username, email')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async findUserById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        apellido,
        email,
        username,
        estado,
        pais_id,
        created_at,
        ultimo_acceso,
        roles (
          id,
          nombre
        ),
        paises (
          id,
          nombre,
          codigo,
          slug
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async createUser(payload) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([payload])
      .select(`
        id,
        nombre,
        apellido,
        email,
        username,
        estado,
        created_at
      `)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateUser(id, payload) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id)
      .select(`
        id,
        nombre,
        apellido,
        email,
        username,
        estado,
        pais_id,
        created_at
      `)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateUserPassword(id, password_hash) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        password_hash,
        password_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, nombre, username')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteUserPermanent(id) {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

module.exports = SupabaseUserRepository;
