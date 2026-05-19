const supabase = require('../config/supabase');
const historialNoticiaRepository = require('../repositories/historialNoticiaRepository');

const registrarVersion = async ({ noticia_id, usuario_id, titulo_anterior, contenido_anterior, estado_anterior, cambios }) => {
  return historialNoticiaRepository.create({ noticia_id, usuario_id, titulo_anterior, contenido_anterior, estado_anterior, cambios });
};

const listarPorNoticia = async (noticiaId, user) => {
  if (user?.rol !== 'superadmin' && user?.pais_id) {
    const { data: noticia } = await supabase.from('noticias').select('pais_id').eq('id', noticiaId).maybeSingle();
    if (!noticia || Number(noticia.pais_id) !== Number(user.pais_id)) {
      throw new Error('No tiene permisos para ver el historial de esta noticia');
    }
  }
  return historialNoticiaRepository.findByNoticiaId(noticiaId);
};

const obtener = async (id) => {
  return historialNoticiaRepository.findById(id);
};

module.exports = { registrarVersion, listarPorNoticia, obtener };
