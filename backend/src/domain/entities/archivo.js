class Archivo {
  constructor({
    id,
    url,
    nombre,
    tipo,
    peso_bytes,
    storage_path,
    subido_por,
    noticia_id = null,
    testimonio_id = null,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.url = url;
    this.nombre = nombre;
    this.tipo = tipo;
    this.peso_bytes = peso_bytes;
    this.storage_path = storage_path;
    this.subido_por = subido_por;
    this.noticia_id = noticia_id;
    this.testimonio_id = testimonio_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Archivo;
