const Auditoria = require('../../domain/auditoria/auditoria');

class AuditoriaService {
  constructor({ auditoriaRepository, userRepository }) {
    this.auditoriaRepository = auditoriaRepository;
    this.userRepository = userRepository;
  }

  async registrar({ usuario_id, username, accion, modulo, detalle, ip_address }) {
    return await this.auditoriaRepository.create({ usuario_id, username, accion, modulo, detalle, ip_address });
  }

  async listar({ limit = 50, offset = 0, modulo, usuario_id, user } = {}) {
    let usuario_ids;
    if (user?.rol === 'admin_pais' && user?.pais_id) {
      const usuarios = await this.userRepository.findUsersByCountry(user.pais_id);
      usuario_ids = usuarios?.map(u => u.id) || [];
      if (usuario_ids.length === 0) return { data: [], count: 0 };
    }
    return await this.auditoriaRepository.findAll({ limit, offset, modulo, usuario_id, usuario_ids });
  }

  async obtener(id) {
    const data = await this.auditoriaRepository.findById(id);
    if (!data) return null;
    return new Auditoria(data);
  }
}

module.exports = AuditoriaService;
