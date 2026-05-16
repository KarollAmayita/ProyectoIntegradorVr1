const categoriaRepository = require('../repositories/categoriaRepository');

const generateSlug = (text) => text
  .toString().toLowerCase().trim()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const listar = async () => categoriaRepository.findAll();

const obtener = async (id) => {
  const cat = await categoriaRepository.findById(id);
  if (!cat) throw new Error('Categoría no encontrada');
  return cat;
};

const crear = async ({ nombre, descripcion }) => {
  if (!nombre) throw new Error('Nombre es obligatorio');
  const slug = generateSlug(nombre);
  const existing = await categoriaRepository.findBySlug(slug);
  if (existing) throw new Error('Ya existe una categoría con ese nombre');
  return categoriaRepository.create({ nombre, slug, descripcion: descripcion || null });
};

const actualizar = async (id, { nombre, descripcion }) => {
  const cat = await categoriaRepository.findById(id);
  if (!cat) throw new Error('Categoría no encontrada');
  const payload = {};
  if (nombre !== undefined) {
    payload.nombre = nombre;
    const slug = generateSlug(nombre);
    const dup = await categoriaRepository.findBySlug(slug);
    if (dup && Number(dup.id) !== Number(id)) throw new Error('Ya existe otra categoría con ese nombre');
    payload.slug = slug;
  }
  if (descripcion !== undefined) payload.descripcion = descripcion;
  return categoriaRepository.update(id, payload);
};

const eliminar = async (id) => {
  const cat = await categoriaRepository.findById(id);
  if (!cat) throw new Error('Categoría no encontrada');
  await categoriaRepository.remove(id);
  return { message: 'Categoría eliminada correctamente' };
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
