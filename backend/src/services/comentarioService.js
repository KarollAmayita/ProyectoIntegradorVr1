const supabase = require('../config/supabase');
const comentarioRepository = require('../repositories/comentarioRepository');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const listar = async (params) => {
  if (params.user?.rol === 'admin_pais' && params.user?.pais_id) {
    const { data: noticias } = await supabase.from('noticias').select('id').eq('pais_id', params.user.pais_id);
    const noticia_ids = noticias?.map(n => n.id) || [];
    if (noticia_ids.length === 0) return { data: [], count: 0 };
    return comentarioRepository.findAll({ ...params, noticia_ids });
  }
  return comentarioRepository.findAll(params);
};

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

const moderar = async (id, estado, user) => {
  if (!['aprobado', 'rechazado'].includes(estado)) throw new Error('Estado no válido');
  const existing = await comentarioRepository.findById(id);
  if (!existing) throw new Error('Comentario no encontrado');
  if (user?.rol !== 'superadmin' && user?.pais_id) {
    const { data: noticia } = await supabase.from('noticias').select('pais_id').eq('id', existing.noticia_id).maybeSingle();
    if (!noticia || Number(noticia.pais_id) !== Number(user.pais_id)) {
      throw new Error('No tiene permisos para moderar este comentario');
    }
  }
  return comentarioRepository.updateEstado(id, estado);
};

const eliminar = async (id, user) => {
  const existing = await comentarioRepository.findById(id);
  if (!existing) throw new Error('Comentario no encontrado');
  if (user?.rol !== 'superadmin' && user?.pais_id) {
    const { data: noticia } = await supabase.from('noticias').select('pais_id').eq('id', existing.noticia_id).maybeSingle();
    if (!noticia || Number(noticia.pais_id) !== Number(user.pais_id)) {
      throw new Error('No tiene permisos para eliminar este comentario');
    }
  }
  await comentarioRepository.remove(id);
  return { message: 'Comentario eliminado correctamente' };
};

module.exports = { listar, listarPublicos, obtener, crear, moderar, eliminar };
