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
    .insert([{ usuario_id: usuario_id, token: token, expires_at: expires_at }])
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

module.exports = {
  findUserByUsername,
  updateLastAccess,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllUserRefreshTokens,
};
