const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const rolRepository = require('../repositories/rolRepository');

const getUsers = async () => {
  return await userRepository.findAllUsers();
};

const createUser = async (payload) => {
  const {
    nombre,
    apellido,
    email,
    username,
    password,
    rol_id,
    pais_id,
    pregunta_seguridad,
    respuesta_seguridad,
  } = payload;

  if (!nombre || !apellido || !email || !username || !password || !rol_id) {
    throw new Error('Nombre, apellido, email, username, password y rol son obligatorios');
  }

  if (!pais_id) {
    const rol = await rolRepository.findRolById(rol_id);
    if (rol?.nombre !== 'superadmin') {
      throw new Error('pais_id es obligatorio para este rol');
    }
  }

  const existingUser = await userRepository.findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    throw new Error('Ya existe un usuario con ese username o email');
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const respuesta_seguridad_hash = respuesta_seguridad
    ? bcrypt.hashSync(respuesta_seguridad, 10)
    : null;

  return await userRepository.createUser({
    nombre,
    apellido,
    email,
    username,
    password_hash,
    pregunta_seguridad: pregunta_seguridad || null,
    respuesta_seguridad_hash,
    rol_id,
    pais_id: pais_id || null,
    estado: 'activo',
  });
};

const updatePassword = async (id, nueva_password) => {
  if (!nueva_password || nueva_password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  const password_hash = bcrypt.hashSync(nueva_password, 10);

  return await userRepository.updateUserPassword(id, password_hash);
};

const updateUser = async (id, payload, requestingUser) => {
  const target = await userRepository.findUserById(id);
  if (!target) throw new Error('Usuario no encontrado');

  if (requestingUser.rol !== 'superadmin' && Number(id) === Number(requestingUser.id)) {
    const allowedFields = ['nombre', 'apellido', 'email'];
    const restricted = {};
    for (const key of Object.keys(payload)) {
      if (!allowedFields.includes(key)) throw new Error('No tienes permiso para modificar este campo');
      restricted[key] = payload[key];
    }
    return userRepository.updateUser(id, { ...restricted, updated_at: new Date().toISOString() });
  }

  if (requestingUser.rol !== 'superadmin') throw new Error('No tienes permisos para modificar este usuario');

  return userRepository.updateUser(id, { ...payload, updated_at: new Date().toISOString() });
};

const deactivateUser = async (id, requestingUser) => {
  if (Number(id) === Number(requestingUser.id)) throw new Error('No puedes desactivarte a ti mismo');
  const target = await userRepository.findUserById(id);
  if (!target) throw new Error('Usuario no encontrado');
  return userRepository.updateUser(id, { estado: 'inactivo', updated_at: new Date().toISOString() });
};

const deleteUserPermanent = async (id, requestingUser) => {
  if (Number(id) === Number(requestingUser.id)) throw new Error('No puedes eliminarte a ti mismo');
  const target = await userRepository.findUserById(id);
  if (!target) throw new Error('Usuario no encontrado');
  await userRepository.deleteUserPermanent(id);
  return { message: 'Usuario eliminado permanentemente' };
};

module.exports = {
  getUsers,
  createUser,
  updatePassword,
  updateUser,
  deactivateUser,
  deleteUserPermanent,
};