const prepararVersion = async (noticiaExistente, nuevosDatos, usuarioId, historialNoticiaService) => {
  const cambios = {};
  let hayCambios = false;
  for (const key of Object.keys(nuevosDatos)) {
    if (noticiaExistente[key] !== undefined && noticiaExistente[key] !== nuevosDatos[key]) {
      cambios[key] = { de: noticiaExistente[key], a: nuevosDatos[key] };
      hayCambios = true;
    }
  }
  if (!hayCambios) return;
  await historialNoticiaService.registrarVersion({
    noticia_id: noticiaExistente.id,
    usuario_id: usuarioId,
    titulo_anterior: noticiaExistente.titulo,
    contenido_anterior: noticiaExistente.contenido,
    estado_anterior: noticiaExistente.estado,
    cambios,
  });
};

module.exports = { prepararVersion };
