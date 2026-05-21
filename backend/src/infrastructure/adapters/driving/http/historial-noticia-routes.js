const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

/**
 * @param {Object} historialNoticiaController
 */
const createHistorialNoticiaRoutes = (historialNoticiaController) => {
  const router = express.Router();
  router.get('/noticia/:noticiaId', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), historialNoticiaController.listar);
  router.get('/:id', verifyToken, historialNoticiaController.obtener);
  return router;
};

module.exports = createHistorialNoticiaRoutes;
