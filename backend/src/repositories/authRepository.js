const supabase = require('../config/supabase');

const findUserByUsername = async (username) => {
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
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const updateLastAccess = async (userId) => {
  const { error } = await supabase
    .from('usuarios')
    .update({ ultimo_acceso: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
};

const createRefreshToken = async (usuario_id, token, expires_at) => {
  const { data, error } = await supabase
    .from('refresh_tokens')
    .insert([{ usuario_id, token, expires_at }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const findRefreshToken = async (token) => {
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
};

const deleteRefreshToken = async (token) => {
  const { error } = await supabase
    .from('refresh_tokens')
    .delete()
    .eq('token', token);

  if (error) {
    throw new Error(error.message);
  }
};

const deleteAllUserRefreshTokens = async (usuario_id) => {
  const { error } = await supabase
    .from('refresh_tokens')
    .delete()
    .eq('usuario_id', usuario_id);

  if (error) {
    throw new Error(error.message);
  }
};

const findUserById = async (id) => {
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
};

const findUserSecurityQuestion = async (identifier) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, username, pregunta_seguridad, respuesta_seguridad_hash')
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const updatePasswordWithTimestamp = async (id, password_hash) => {
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
};

const updateSecurityQuestion = async (id, pregunta_seguridad, respuesta_seguridad_hash) => {
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
};

module.exports = {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  findUserSecurityQuestion,
  updateLastAccess,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllUserRefreshTokens,
  updatePasswordWithTimestamp,
  updateSecurityQuestion,
};
