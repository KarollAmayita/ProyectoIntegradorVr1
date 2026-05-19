const testimonialService = require('../services/testimonialService');
const auditoriaService = require('../services/auditoriaService');

const listTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialService.getTestimonials(req.user);

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const listPublicTestimonials = async (req, res) => {
  try {
    const { countrySlug } = req.params;

    const testimonials = await testimonialService.getPublicTestimonialsByCountry(countrySlug);

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body, req.user);

    auditoriaService.registrar({
      usuario_id: req.user.id, username: req.user.username,
      accion: 'Crear testimonio', modulo: 'testimonios',
      detalle: { nombre: req.body.nombre, pais_id: req.body.pais_id },
      ip_address: req.ip,
    }).catch(() => {});

    return res.status(201).json({
      message: 'Testimonio creado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialService.updateTestimonial(
      id,
      req.body,
      req.user
    );

    return res.status(200).json({
      message: 'Testimonio actualizado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await testimonialService.deleteTestimonial(id, req.user);

    auditoriaService.registrar({
      usuario_id: req.user.id, username: req.user.username,
      accion: 'Eliminar testimonio', modulo: 'testimonios',
      detalle: { id },
      ip_address: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const createPublicTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialService.createPublicTestimonial(req.body);

    return res.status(201).json({
      message: 'Testimonio enviado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id, req.user);
    return res.status(200).json(testimonial);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await testimonialService.updateTestimonialStatus(req.params.id, req.body, req.user);

    auditoriaService.registrar({
      usuario_id: req.user.id, username: req.user.username,
      accion: 'Moderar testimonio', modulo: 'testimonios',
      detalle: { id: req.params.id, estado: req.body.estado },
      ip_address: req.ip,
    }).catch(() => {});

    return res.status(200).json({ message: 'Estado actualizado correctamente', data: testimonial });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateTestimonialPhoto = async (req, res) => {
  try {
    const testimonial = await testimonialService.updateTestimonialPhoto(req.params.id, req.body, req.user);
    return res.status(200).json({ message: 'Foto actualizada correctamente', data: testimonial });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listTestimonials,
  listPublicTestimonials,
  createTestimonial,
  createPublicTestimonial,
  getTestimonialById,
  updateTestimonial,
  updateTestimonialStatus,
  updateTestimonialPhoto,
  deleteTestimonial,
};