class Auditoria {
  constructor({
    id,
    usuario_id,
    username,
    accion,
    modulo,
    detalle,
    ip_address,
    created_at
  }) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.username = username;
    this.accion = accion;
    this.modulo = modulo;
    this.detalle = detalle;
    this.ip_address = ip_address;
    this.created_at = created_at;
  }
}

module.exports = Auditoria;
