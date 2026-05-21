const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createAuditoriaRoutes = (auditoriaController) => {
  const router = express.Router();

  router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), auditoriaController.registrar);
  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), auditoriaController.listar);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), auditoriaController.obtener);

  return router;
};

module.exports = createAuditoriaRoutes;
