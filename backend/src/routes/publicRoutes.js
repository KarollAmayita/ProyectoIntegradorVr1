const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const testimonialController = require('../controllers/testimonialController');
const contactRequestController = require('../controllers/contactRequestController');

// /api/public/paises/:paisSlug/noticias
router.get('/paises/:countrySlug/noticias', newsController.listPublicNews);
router.get('/paises/:countrySlug/noticias/:newsSlug', newsController.getPublicNewsDetail);
router.get('/paises/:countrySlug/testimonios', testimonialController.listPublicTestimonials);
router.post('/paises/:countrySlug/solicitudes', contactRequestController.createPublicRequest);

module.exports = router;
