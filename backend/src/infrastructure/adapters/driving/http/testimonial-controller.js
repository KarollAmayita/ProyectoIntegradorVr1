const { AppError } = require('../../../../utils/errors');

class TestimonialController {
  constructor(testimonialService) {
    this.testimonialService = testimonialService;
  }

  getTestimonials = async (req, res) => {
    try {
      const testimonials = await this.testimonialService.getTestimonials(req.user);
      return res.status(200).json(testimonials);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getPublicTestimonialsByCountry = async (req, res) => {
    try {
      const { countrySlug } = req.params;
      const testimonials = await this.testimonialService.getPublicTestimonialsByCountry(countrySlug);
      return res.status(200).json(testimonials);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  createTestimonial = async (req, res) => {
    try {
      const testimonial = await this.testimonialService.createTestimonial(req.body, req.user);
      return res.status(201).json({
        message: 'Testimonio creado correctamente',
        data: testimonial,
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  createPublicTestimonial = async (req, res) => {
    try {
      const testimonial = await this.testimonialService.createPublicTestimonial(req.body);
      return res.status(201).json({
        message: 'Testimonio enviado para revisión',
        data: testimonial,
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getTestimonialById = async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await this.testimonialService.getTestimonialById(id, req.user);
      return res.status(200).json(testimonial);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await this.testimonialService.updateTestimonial(id, req.body, req.user);
      return res.status(200).json({
        message: 'Testimonio actualizado correctamente',
        data: testimonial,
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  deleteTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.testimonialService.deleteTestimonial(id, req.user);
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateTestimonialStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await this.testimonialService.updateTestimonialStatus(id, req.body, req.user);
      return res.status(200).json(testimonial);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateTestimonialPhoto = async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await this.testimonialService.updateTestimonialPhoto(id, req.body, req.user);
      return res.status(200).json(testimonial);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  _handleError(error, res) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ 
        success: false, 
        message: error.message 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}

module.exports = TestimonialController;
