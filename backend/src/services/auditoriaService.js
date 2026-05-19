const supabase = require('../config/supabase');
const auditoriaRepository = require('../repositories/auditoriaRepository');

const registrar = async ({ usuario_id, username, accion, modulo, detalle, ip_address }) => {
  return auditoriaRepository.create({ usuario_id, username, accion, modulo, detalle, ip_address });
};

const listar = async ({ limit, offset, modulo, usuario_id, user } = {}) => {
  let usuario_ids;

  if (user && user.rol === 'admin_pais' && user.pais_id) {
    const { data: usuarios } = await supabase
      .from('usuarios')
      .select('id')
      .eq('pais_id', user.pais_id);
    usuario_ids = usuarios?.map(u => u.id) || [];

    if (usuario_ids.length === 0) return { data: [], count: 0 };
  }

  return auditoriaRepository.findAll({ limit, offset, modulo, usuario_id, usuario_ids });
};

const obtener = async (id) => {
  return auditoriaRepository.findById(id);
};

module.exports = { registrar, listar, obtener };
