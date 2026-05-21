class AuditoriaPort {
  async registrar({ usuario_id, username, accion, modulo, detalle, ip_address }) {
    throw new Error('Method not implemented');
  }
  async listar({ limit, offset, modulo, usuario_id, usuario_ids }) {
    throw new Error('Method not implemented');
  }
  async obtener(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = AuditoriaPort;
