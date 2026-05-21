class HistorialNoticia {
  constructor({
    id,
    noticia_id,
    usuario_id,
    titulo_anterior,
    contenido_anterior,
    estado_anterior,
    cambios,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.noticia_id = noticia_id;
    this.usuario_id = usuario_id;
    this.titulo_anterior = titulo_anterior;
    this.contenido_anterior = contenido_anterior;
    this.estado_anterior = estado_anterior;
    this.cambios = cambios;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = HistorialNoticia;
