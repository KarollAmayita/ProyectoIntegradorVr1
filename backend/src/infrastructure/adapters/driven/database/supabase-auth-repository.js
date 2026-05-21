const AuthRepository = require('../../../../ports/auth/outbound/auth-repository');
const supabase = require('../../../../config/supabase');

class SupabaseAuthRepository extends AuthRepository {
  async findUserByUsername(username) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        apellido,
        email,
        username,
        password_hash,
        estado,
        pais_id,
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
      .eq('username', username)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findUserById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        id,
        nombre,
        apellido,
        username,
        email,
        password_hash,
        pregunta_seguridad,
        respuesta_seguridad_hash,
        password_updated_at,
        estado,
        pais_id,
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

  async findUserSecurityQuestion(identifier) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, username, pregunta_seguridad, respuesta_seguridad_hash')
      .or(`username.eq.${identifier},email.eq.${identifier}`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateLastAccess(userId) {
    const { error } = await supabase
      .from('usuarios')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async createRefreshToken(usuario_id, token, expires_at) {
    const { data, error } = await supabase
      .from('refresh_tokens')
      .insert([{ usuario_id, token, expires_at }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findRefreshToken(token) {
    const { data, error } = await supabase
      .from('refresh_tokens')
      .select(`
        *,
        usuarios (
          id,
          username,
          email,
          estado,
          roles (nombre)
        )
      `)
      .eq('token', token)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteRefreshToken(token) {
    const { error } = await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', token);

    if (error) {
      throw new Error(error.message);
    }
  }

  async deleteAllUserRefreshTokens(usuario_id) {
    const { error } = await supabase
      .from('refresh_tokens')
      .delete()
      .eq('usuario_id', usuario_id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async updatePasswordWithTimestamp(id, password_hash) {
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

  async updateSecurityQuestion(id, pregunta_seguridad, respuesta_seguridad_hash) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        pregunta_seguridad,
        respuesta_seguridad_hash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, username')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = SupabaseAuthRepository;
