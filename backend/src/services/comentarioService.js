const comentarioRepository = require('../repositories/comentarioRepository');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const listar = async (params) => comentarioRepository.findAll(params);

const listarPublicos = async (noticiaId, params) => comentarioRepository.findByNoticiaId(noticiaId, params);

const obtener = async (id) => {
  const c = await comentarioRepository.findById(id);
  if (!c) throw new Error('Comentario no encontrado');
  return c;
};

const crear = async ({ noticia_id, nombre, email, contenido }) => {
  if (!noticia_id || !nombre || !contenido) throw new Error('Noticia, nombre y contenido son obligatorios');
  if (email && !isValidEmail(email)) throw new Error('Email no válido');
  return comentarioRepository.create({ noticia_id, nombre, email: email || null, contenido, estado: 'pendiente' });
};

const moderar = async (id, estado) => {
  if (!['aprobado', 'rechazado'].includes(estado)) throw new Error('Estado no válido');
  const existing = await comentarioRepository.findById(id);
  if (!existing) throw new Error('Comentario no encontrado');
  return comentarioRepository.updateEstado(id, estado);
};

const eliminar = async (id) => {
  const existing = await comentarioRepository.findById(id);
  if (!existing) throw new Error('Comentario no encontrado');
  await comentarioRepository.remove(id);
  return { message: 'Comentario eliminado correctamente' };
};

module.exports = { listar, listarPublicos, obtener, crear, moderar, eliminar };
