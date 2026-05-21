class Notificacion {
  constructor({
    id,
    usuario_id,
    titulo,
    mensaje,
    tipo,
    leida = false,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.tipo = tipo;
    this.leida = leida;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Notificacion;
