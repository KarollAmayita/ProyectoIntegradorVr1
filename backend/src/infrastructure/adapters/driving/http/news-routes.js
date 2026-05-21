const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createNewsRoutes = (newsController) => {
  const router = express.Router();

  router.get('/public/:countrySlug', newsController.getPublicNewsByCountry);
  router.get('/public/:countrySlug/:newsSlug', newsController.getPublicNewsDetail);
  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.getNews);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.getNewsById);
  router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.createNews);
  router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.updateNews);
  router.patch('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.updateNews);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.deleteNews);
  router.patch('/:id/status', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.updateNewsStatus);
  router.patch('/:id/image', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), newsController.updateNewsImage);

  return router;
};

module.exports = createNewsRoutes;
