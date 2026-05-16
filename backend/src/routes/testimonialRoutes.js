const express = require('express');
const router = express.Router();

const testimonialController = require('../controllers/testimonialController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/*
  RUTAS PÚBLICAS
*/

router.post(
  '/public',
  testimonialController.createPublicTestimonial
);

router.get(
  '/public/:countrySlug',
  testimonialController.listPublicTestimonials
);

/*
  RUTAS ADMINISTRATIVAS
*/

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.listTestimonials
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.createTestimonial
);

router.get(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.getTestimonialById
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.updateTestimonial
);

router.patch(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.updateTestimonial
);

router.patch(
  '/:id/estado',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.updateTestimonialStatus
);

router.patch(
  '/:id/foto',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  testimonialController.updateTestimonialPhoto
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais'),
  testimonialController.deleteTestimonial
);

module.exports = router;