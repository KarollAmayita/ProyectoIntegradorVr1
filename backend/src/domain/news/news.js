class News {
  constructor({
    id,
    titulo,
    slug,
    resumen,
    contenido,
    imagen_principal_url,
    estado,
    pais_id,
    autor_id,
    fecha_publicacion,
    updated_at,
    created_at
  }) {
    this.id = id;
    this.titulo = titulo;
    this.slug = slug;
    this.resumen = resumen;
    this.contenido = contenido;
    this.imagen_principal_url = imagen_principal_url;
    this.estado = estado || 'borrador';
    this.pais_id = pais_id;
    this.autor_id = autor_id;
    this.fecha_publicacion = fecha_publicacion;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }

  get isPublished() {
    return this.estado === 'publicado';
  }
}

module.exports = News;
