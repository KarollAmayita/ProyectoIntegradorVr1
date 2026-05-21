const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createTestimonialRoutes = (testimonialController) => {
  const router = express.Router();

  router.get('/public/:countrySlug', testimonialController.getPublicTestimonialsByCountry);
  router.post('/public', testimonialController.createPublicTestimonial);
  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.getTestimonials);
  router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.createTestimonial);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.getTestimonialById);
  router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.updateTestimonial);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.deleteTestimonial);
  router.patch('/:id/status', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.updateTestimonialStatus);
  router.patch('/:id/photo', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), testimonialController.updateTestimonialPhoto);

  return router;
};

module.exports = createTestimonialRoutes;
