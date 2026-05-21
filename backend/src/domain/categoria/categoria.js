class Categoria {
  constructor({
    id,
    nombre,
    slug,
    descripcion
  }) {
    this.id = id;
    this.nombre = nombre;
    this.slug = slug;
    this.descripcion = descripcion;
  }
}

module.exports = Categoria;
