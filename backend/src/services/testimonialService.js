const testimonialRepository = require('../repositories/testimonialRepository');

const getTestimonials = async (user) => {
  if (user.rol === 'superadmin') {
    return await testimonialRepository.findAllTestimonials();
  }

  return await testimonialRepository.findTestimonialsByCountry(user.pais_id);
};

const getPublicTestimonialsByCountry = async (countrySlug) => {
  if (!countrySlug) {
    throw new Error('El país es obligatorio');
  }

  return await testimonialRepository.findPublishedTestimonialsByCountrySlug(countrySlug);
};

const createTestimonial = async (payload, user) => {
  const {
    nombre,
    cargo,
    empresa,
    contenido,
    foto_url,
    instagram_url,
    facebook_url,
    estado = 'borrador',
    destacado = false,
    pais_id,
  } = payload;

  if (!nombre || !contenido || !foto_url) {
    throw new Error('Nombre, contenido y foto son obligatorios');
  }

  let finalPaisId = pais_id;

  if (user.rol !== 'superadmin') {
    finalPaisId = user.pais_id;
  }

  if (!finalPaisId) {
    throw new Error('El país es obligatorio para crear un testimonio');
  }

  const finalEstado = estado || 'borrador';

  const fecha_publicacion =
    finalEstado === 'publicado' ? new Date().toISOString() : null;

  return await testimonialRepository.createTestimonial({
    pais_id: finalPaisId,
    nombre,
    cargo: cargo || null,
    empresa: empresa || null,
    contenido,
    foto_url,
    instagram_url: instagram_url || null,
    facebook_url: facebook_url || null,
    estado: finalEstado,
    destacado: Boolean(destacado),
    autor_id: user.id,
    fecha_publicacion,
  });
};

const updateTestimonial = async (id, payload, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);

  if (!existingTestimonial) {
    throw new Error('El testimonio no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingTestimonial.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para modificar este testimonio');
  }

  const allowedFields = [
    'nombre',
    'cargo',
    'empresa',
    'contenido',
    'foto_url',
    'instagram_url',
    'facebook_url',
    'estado',
    'destacado',
  ];

  const updatePayload = {};

  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updatePayload[field] = payload[field];
    }
  });

  if (
    payload.estado === 'publicado' &&
    existingTestimonial.estado !== 'publicado'
  ) {
    updatePayload.fecha_publicacion = new Date().toISOString();
  }

  if (payload.estado && payload.estado !== 'publicado') {
    updatePayload.fecha_publicacion = null;
  }

  updatePayload.updated_at = new Date().toISOString();

  return await testimonialRepository.updateTestimonial(id, updatePayload);
};

const deleteTestimonial = async (id, user) => {
  const existingTestimonial = await testimonialRepository.findTestimonialById(id);

  if (!existingTestimonial) {
    throw new Error('El testimonio no existe');
  }

  if (
    user.rol !== 'superadmin' &&
    Number(existingTestimonial.pais_id) !== Number(user.pais_id)
  ) {
    throw new Error('No tiene permisos para eliminar este testimonio');
  }

  if (user.rol === 'editor') {
    throw new Error('El editor no tiene permisos para eliminar testimonios');
  }

  await testimonialRepository.deleteTestimonial(id);

  return {
    message: 'Testimonio eliminado correctamente',
  };
};

const createPublicTestimonial = async (payload) => {
  const {
    pais_id,
    nombre,
    cargo,
    empresa,
    contenido,
    foto_url,
    instagram_url,
    facebook_url,
  } = payload;

  if (!pais_id || !nombre || !contenido) {
    throw new Error('País, nombre y contenido son obligatorios');
  }

  const defaultPhotoUrl = '../../../assets/img/portales/default_avatar.png';

  const { data: systemUser } = await testimonialRepository.findSystemUser();
  const autorId = systemUser?.id || 1;

  return await testimonialRepository.createTestimonial({
    pais_id,
    nombre,
    cargo: cargo || null,
    empresa: empresa || null,
    contenido,
    foto_url: foto_url || defaultPhotoUrl,
    instagram_url: instagram_url || null,
    facebook_url: facebook_url || null,
    estado: 'borrador',
    destacado: false,
    autor_id: autorId,
    fecha_publicacion: null,
  });
};

const getTestimonialById = async (id, user) => {
  const testimonial = await testimonialRepository.findTestimonialById(id);
  if (!testimonial) throw new Error('Testimonio no encontrado');
  if (user.rol !== 'superadmin' && Number(testimonial.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para ver este testimonio');
  }
  return testimonial;
};

const updateTestimonialStatus = async (id, payload, user) => {
  const { estado } = payload;
  if (!estado || !['borrador', 'publicado', 'archivado'].includes(estado)) {
    throw new Error('Estado no válido');
  }
  const existing = await testimonialRepository.findTestimonialById(id);
  if (!existing) throw new Error('Testimonio no encontrado');
  if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para modificar este testimonio');
  }
  const updatePayload = { estado, updated_at: new Date().toISOString() };
  if (estado === 'publicado' && existing.estado !== 'publicado') updatePayload.fecha_publicacion = new Date().toISOString();
  if (estado !== 'publicado') updatePayload.fecha_publicacion = null;
  return testimonialRepository.updateTestimonial(id, updatePayload);
};

const updateTestimonialPhoto = async (id, payload, user) => {
  const { foto_url } = payload;
  if (!foto_url) throw new Error('URL de foto requerida');
  const existing = await testimonialRepository.findTestimonialById(id);
  if (!existing) throw new Error('Testimonio no encontrado');
  if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
    throw new Error('No tiene permisos para modificar este testimonio');
  }
  return testimonialRepository.updateTestimonial(id, { foto_url, updated_at: new Date().toISOString() });
};

module.exports = {
  getTestimonials,
  getPublicTestimonialsByCountry,
  createTestimonial,
  createPublicTestimonial,
  getTestimonialById,
  updateTestimonial,
  updateTestimonialStatus,
  updateTestimonialPhoto,
  deleteTestimonial,
};