class Testimonial {
  constructor({
    id,
    nombre,
    cargo,
    empresa,
    contenido,
    foto_url,
    instagram_url,
    facebook_url,
    estado,
    destacado,
    pais_id,
    autor_id,
    fecha_publicacion,
    updated_at,
    created_at
  }) {
    this.id = id;
    this.nombre = nombre;
    this.cargo = cargo;
    this.empresa = empresa;
    this.contenido = contenido;
    this.foto_url = foto_url;
    this.instagram_url = instagram_url;
    this.facebook_url = facebook_url;
    this.estado = estado || 'borrador';
    this.destacado = Boolean(destacado);
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

module.exports = Testimonial;
