const Categoria = require('../../domain/categoria/categoria');

class CategoriaService {
  constructor({ categoriaRepository }) {
    this.categoriaRepository = categoriaRepository;
  }

  async listar() {
    const data = await this.categoriaRepository.findAll();
    return data.map(c => new Categoria(c));
  }

  async obtener(id) {
    const data = await this.categoriaRepository.findById(id);
    if (!data) throw new Error('Categoría no encontrada');
    return new Categoria(data);
  }

  async crear({ nombre, descripcion }) {
    if (!nombre) throw new Error('Nombre es obligatorio');
    
    const slug = this._generateSlug(nombre);
    const existing = await this.categoriaRepository.findBySlug(slug);
    if (existing) throw new Error('Ya existe una categoría con ese nombre');

    const data = await this.categoriaRepository.create({ 
      nombre, 
      slug, 
      descripcion: descripcion || null 
    });
    return new Categoria(data);
  }

  async actualizar(id, { nombre, descripcion }) {
    const existing = await this.categoriaRepository.findById(id);
    if (!existing) throw new Error('Categoría no encontrada');

    const payload = {};
    if (nombre !== undefined) {
      const slug = this._generateSlug(nombre);
      const dup = await this.categoriaRepository.findBySlug(slug);
      if (dup && Number(dup.id) !== Number(id)) {
        throw new Error('Ya existe otra categoría con ese nombre');
      }
      payload.nombre = nombre;
      payload.slug = slug;
    }
    if (descripcion !== undefined) payload.descripcion = descripcion;

    const data = await this.categoriaRepository.update(id, payload);
    return new Categoria(data);
  }

  async eliminar(id) {
    const existing = await this.categoriaRepository.findById(id);
    if (!existing) throw new Error('Categoría no encontrada');
    await this.categoriaRepository.remove(id);
    return { message: 'Categoría eliminada correctamente' };
  }

  _generateSlug(text) {
    return text
      .toString().toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  }
}

module.exports = CategoriaService;
