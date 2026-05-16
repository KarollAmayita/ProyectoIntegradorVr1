const notificacionRepository = require('../repositories/notificacionRepository');

const TIPOS_VALIDOS = ['info', 'exito', 'advertencia', 'error'];

const crear = async ({ usuario_id, titulo, mensaje, tipo = 'info' }) => {
  if (!usuario_id || !titulo || !mensaje) throw new Error('Usuario, título y mensaje son obligatorios');
  if (!TIPOS_VALIDOS.includes(tipo)) throw new Error('Tipo no válido');
  return notificacionRepository.create({ usuario_id, titulo, mensaje, tipo });
};

const listar = async (usuarioId, { limit, offset, soloNoLeidas } = {}) => {
  return notificacionRepository.findByUsuarioId(usuarioId, { limit, offset, soloNoLeidas });
};

const marcarLeida = async (id, usuarioId) => {
  const notif = await notificacionRepository.findByUsuarioId(usuarioId, { limit: 1 });
  if (!notif.data.find(n => Number(n.id) === Number(id))) throw new Error('Notificación no encontrada');
  return notificacionRepository.marcarLeida(id);
};

const marcarTodasLeidas = async (usuarioId) => {
  await notificacionRepository.marcarTodasLeidas(usuarioId);
};

const contarNoLeidas = async (usuarioId) => {
  return notificacionRepository.countNoLeidas(usuarioId);
};

module.exports = { crear, listar, marcarLeida, marcarTodasLeidas, contarNoLeidas };
