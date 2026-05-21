const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

/**
 * @param {Object} archivoController
 */
const createArchivoRoutes = (archivoController) => {
  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivoController.listar);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivoController.obtener);
  router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivoController.registrarUrl);
  router.post('/upload', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivoController.upload);
  router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivoController.actualizar);
  router.patch('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivoController.actualizar);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), archivoController.eliminar);

  return router;
};

module.exports = createArchivoRoutes;

