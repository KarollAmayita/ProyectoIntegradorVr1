class Country {
  constructor({
    id,
    nombre,
    codigo,
    slug,
    estado,
    created_at
  }) {
    this.id = id;
    this.nombre = nombre;
    this.codigo = codigo;
    this.slug = slug;
    this.estado = estado;
    this.created_at = created_at;
  }

  get isActive() {
    return this.estado === 'activo';
  }
}

module.exports = Country;
