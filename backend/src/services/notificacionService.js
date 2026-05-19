const notificacionRepository = require('../repositories/notificacionRepository');

const listar = async (usuarioId, { limit, offset, soloNoLeidas } = {}) => {
  return notificacionRepository.findByUsuarioId(usuarioId, { limit, offset, soloNoLeidas });
};

const marcarLeida = async (id, usuarioId) => {
  const notif = await notificacionRepository.findById(id);
  if (!notif || Number(notif.usuario_id) !== Number(usuarioId)) throw new Error('Notificación no encontrada');
  return notificacionRepository.marcarLeida(id);
};

const marcarTodasLeidas = async (usuarioId) => {
  await notificacionRepository.marcarTodasLeidas(usuarioId);
};

const contarNoLeidas = async (usuarioId) => {
  return notificacionRepository.countNoLeidas(usuarioId);
};

module.exports = { listar, marcarLeida, marcarTodasLeidas, contarNoLeidas };
