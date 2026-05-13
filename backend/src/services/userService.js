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

  return await userRepository.createUser({
    nombre,
    apellido,
    email,
    username,
    password_hash,
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

module.exports = {
  getUsers,
  createUser,
  updatePassword,
};