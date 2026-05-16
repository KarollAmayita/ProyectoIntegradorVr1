const historialNoticiaRepository = require('../repositories/historialNoticiaRepository');

const registrarVersion = async ({ noticia_id, usuario_id, titulo_anterior, contenido_anterior, estado_anterior, cambios }) => {
  return historialNoticiaRepository.create({ noticia_id, usuario_id, titulo_anterior, contenido_anterior, estado_anterior, cambios });
};

const listarPorNoticia = async (noticiaId) => {
  return historialNoticiaRepository.findByNoticiaId(noticiaId);
};

const obtener = async (id) => {
  return historialNoticiaRepository.findById(id);
};

module.exports = { registrarVersion, listarPorNoticia, obtener };
