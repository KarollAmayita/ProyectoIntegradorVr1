const Testimonial = require('../../domain/testimonial/testimonial');
const { AuthenticationError, ValidationError, NotFoundError } = require('../../utils/errors');

class TestimonialService {
  constructor({ testimonialRepository, systemUserPort }) {
    this.testimonialRepository = testimonialRepository;
    this.systemUserPort = systemUserPort;
  }

  async getTestimonials(user) {
    if (user.rol === 'superadmin') {
      return await this.testimonialRepository.findAllTestimonials();
    }

    return await this.testimonialRepository.findTestimonialsByCountry(user.pais_id);
  }

  async getPublicTestimonialsByCountry(countrySlug) {
    if (!countrySlug) {
      throw new ValidationError('El país es obligatorio');
    }

    return await this.testimonialRepository.findPublishedTestimonialsByCountrySlug(countrySlug);
  }

  async createTestimonial(payload, user) {
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
      throw new ValidationError('Nombre, contenido y foto son obligatorios');
    }

    let finalPaisId = pais_id;

    if (user.rol !== 'superadmin') {
      finalPaisId = user.pais_id;
    }

    if (!finalPaisId) {
      throw new ValidationError('El país es obligatorio para crear un testimonio');
    }

    const finalEstado = estado || 'borrador';

    const fecha_publicacion =
      finalEstado === 'publicado' ? new Date().toISOString() : null;

    return await this.testimonialRepository.createTestimonial({
      pais_id: finalPaisId,
      nombre,
      cargo: cargo || null,
      empresa: empresa || null,
      contenido,
      foto_url: foto_url || '../../../assets/img/portales/default_avatar.png',
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      estado: finalEstado,
      destacado: Boolean(destacado),
      autor_id: user.id,
      fecha_publicacion,
    });
  }

  async createPublicTestimonial(payload) {
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
      throw new ValidationError('País, nombre y contenido son obligatorios');
    }

    const defaultPhotoUrl = '../../../assets/img/portales/default_avatar.png';
    const systemUser = await this.systemUserPort.findSystemUser();
    const autorId = systemUser?.id || 1;

    return await this.testimonialRepository.createTestimonial({
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
  }

  async getTestimonialById(id, user) {
    const testimonialData = await this.testimonialRepository.findTestimonialById(id);
    if (!testimonialData) throw new NotFoundError('Testimonio no encontrado');
    if (user.rol !== 'superadmin' && Number(testimonialData.pais_id) !== Number(user.pais_id)) {
      throw new AuthenticationError('No tiene permisos para ver este testimonio');
    }
    return testimonialData;
  }

  async updateTestimonial(id, payload, user) {
    const existingTestimonialData = await this.testimonialRepository.findTestimonialById(id);

    if (!existingTestimonialData) {
      throw new NotFoundError('El testimonio no existe');
    }

    if (
      user.rol !== 'superadmin' &&
      Number(existingTestimonialData.pais_id) !== Number(user.pais_id)
    ) {
      throw new AuthenticationError('No tiene permisos para modificar este testimonio');
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
      existingTestimonialData.estado !== 'publicado'
    ) {
      updatePayload.fecha_publicacion = new Date().toISOString();
    }

    if (payload.estado && payload.estado !== 'publicado') {
      updatePayload.fecha_publicacion = null;
    }

    updatePayload.updated_at = new Date().toISOString();

    return await this.testimonialRepository.updateTestimonial(id, updatePayload);
  }

  async deleteTestimonial(id, user) {
    const existingTestimonialData = await this.testimonialRepository.findTestimonialById(id);

    if (!existingTestimonialData) {
      throw new NotFoundError('El testimonio no existe');
    }

    if (
      user.rol !== 'superadmin' &&
      Number(existingTestimonialData.pais_id) !== Number(user.pais_id)
    ) {
      throw new AuthenticationError('No tiene permisos para eliminar este testimonio');
    }

    if (user.rol === 'editor') {
      throw new AuthenticationError('El editor no tiene permisos para eliminar testimonios');
    }

    await this.testimonialRepository.deleteTestimonial(id);

    return {
      message: 'Testimonio eliminado correctamente',
    };
  }

  async updateTestimonialStatus(id, payload, user) {
    const { estado } = payload;
    if (!estado || !['borrador', 'publicado', 'despublicado'].includes(estado)) {
      throw new ValidationError('Estado no válido');
    }
    const existing = await this.testimonialRepository.findTestimonialById(id);
    if (!existing) throw new NotFoundError('Testimonio no encontrado');
    if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
      throw new AuthenticationError('No tiene permisos para modificar este testimonio');
    }
    const updatePayload = { estado, updated_at: new Date().toISOString() };
    if (estado === 'publicado' && existing.estado !== 'publicado') updatePayload.fecha_publicacion = new Date().toISOString();
    if (estado !== 'publicado') updatePayload.fecha_publicacion = null;
    return this.testimonialRepository.updateTestimonial(id, updatePayload);
  }

  async updateTestimonialPhoto(id, payload, user) {
    const { foto_url } = payload;
    if (!foto_url) throw new ValidationError('URL de foto requerida');
    const existing = await this.testimonialRepository.findTestimonialById(id);
    if (!existing) throw new NotFoundError('Testimonio no encontrado');
    if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
      throw new AuthenticationError('No tiene permisos para modificar este testimonio');
    }
    return this.testimonialRepository.updateTestimonial(id, { foto_url, updated_at: new Date().toISOString() });
  }
}

module.exports = TestimonialService;
