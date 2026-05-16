const auditoriaRepository = require('../repositories/auditoriaRepository');

const registrar = async ({ usuario_id, username, accion, modulo, detalle, ip_address }) => {
  return auditoriaRepository.create({ usuario_id, username, accion, modulo, detalle, ip_address });
};

const listar = async ({ limit, offset, modulo, usuario_id } = {}) => {
  return auditoriaRepository.findAll({ limit, offset, modulo, usuario_id });
};

const obtener = async (id) => {
  return auditoriaRepository.findById(id);
};

module.exports = { registrar, listar, obtener };
