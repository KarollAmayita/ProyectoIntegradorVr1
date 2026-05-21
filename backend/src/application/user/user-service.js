const User = require('../../domain/auth/user');
const { AuthenticationError, ValidationError } = require('../../utils/errors');

class UserService {
  constructor({ userRepository, rolRepository, passwordHasher, auditoriaPort }) {
    this.userRepository = userRepository;
    this.rolRepository = rolRepository;
    this.passwordHasher = passwordHasher;
    this.auditoriaPort = auditoriaPort;
  }

  async getUsers(requestingUser) {
    if (!requestingUser || requestingUser.rol === 'superadmin') {
      return await this.userRepository.findAllUsers();
    }
    return await this.userRepository.findUsersByCountry(requestingUser.pais_id);
  }

  async createUser(payload, requestingUser, ipAddress) {
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
      throw new ValidationError('Nombre, apellido, email, username, password y rol son obligatorios');
    }

    if (!pais_id) {
      const rol = await this.rolRepository.findRolById(rol_id);
      if (rol?.nombre !== 'superadmin') {
        throw new ValidationError('pais_id es obligatorio para este rol');
      }
    }

    const existingUser = await this.userRepository.findUserByUsernameOrEmail(username, email);

    if (existingUser) {
      throw new Error('Ya existe un usuario con ese username o email');
    }

    const password_hash = await this.passwordHasher.hash(password);
    const respuesta_seguridad_hash = respuesta_seguridad
      ? await this.passwordHasher.hash(respuesta_seguridad)
      : null;

    const user = await this.userRepository.createUser({
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

    if (requestingUser && this.auditoriaPort) {
      this.auditoriaPort.registrar({
        usuario_id: requestingUser.id,
        username: requestingUser.username,
        accion: 'Crear usuario',
        modulo: 'usuarios',
        detalle: { username: payload.username, rol_id: payload.rol_id, pais_id: payload.pais_id },
        ip_address: ipAddress,
      }).catch(() => {});
    }

    return user;
  }

  async updatePassword(id, nueva_password) {
    if (!nueva_password || nueva_password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
    }

    const password_hash = await this.passwordHasher.hash(nueva_password);

    return await this.userRepository.updateUserPassword(id, password_hash);
  }

  async updateUser(id, payload, requestingUser) {
    const target = await this.userRepository.findUserById(id);
    if (!target) throw new Error('Usuario no encontrado');

    if (requestingUser.rol !== 'superadmin' && Number(id) === Number(requestingUser.id)) {
      const allowedFields = ['nombre', 'apellido', 'email'];
      const restricted = {};
      for (const key of Object.keys(payload)) {
        if (!allowedFields.includes(key)) throw new Error('No tienes permiso para modificar este campo');
        restricted[key] = payload[key];
      }
      return this.userRepository.updateUser(id, { ...restricted, updated_at: new Date().toISOString() });
    }

    if (requestingUser.rol !== 'superadmin') throw new Error('No tienes permisos para modificar este usuario');

    return this.userRepository.updateUser(id, { ...payload, updated_at: new Date().toISOString() });
  }

  async deactivateUser(id, requestingUser, ipAddress) {
    if (Number(id) === Number(requestingUser.id)) throw new Error('No puedes desactivarte a ti mismo');
    const target = await this.userRepository.findUserById(id);
    if (!target) throw new Error('Usuario no encontrado');
    const result = await this.userRepository.updateUser(id, { estado: 'inactivo', updated_at: new Date().toISOString() });

    if (this.auditoriaPort) {
      this.auditoriaPort.registrar({
        usuario_id: requestingUser.id,
        username: requestingUser.username,
        accion: 'Desactivar usuario',
        modulo: 'usuarios',
        detalle: { usuario_id_desactivado: id },
        ip_address: ipAddress,
      }).catch(() => {});
    }

    return result;
  }

  async deleteUserPermanent(id, requestingUser, ipAddress) {
    if (Number(id) === Number(requestingUser.id)) throw new Error('No puedes eliminarte a ti mismo');
    const target = await this.userRepository.findUserById(id);
    if (!target) throw new Error('Usuario no encontrado');
    await this.userRepository.deleteUserPermanent(id);

    if (this.auditoriaPort) {
      this.auditoriaPort.registrar({
        usuario_id: requestingUser.id,
        username: requestingUser.username,
        accion: 'Eliminar usuario permanentemente',
        modulo: 'usuarios',
        detalle: { usuario_id_eliminado: id },
        ip_address: ipAddress,
      }).catch(() => {});
    }

    return { message: 'Usuario eliminado permanentemente' };
  }
}

module.exports = UserService;
