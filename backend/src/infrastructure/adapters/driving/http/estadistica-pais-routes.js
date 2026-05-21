const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createEstadisticaPaisRoutes = (estadisticaPaisController) => {
  const router = express.Router();

  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.listar);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.obtener);
  router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.crear);
  router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.actualizar);
  router.patch('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.actualizar);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.eliminar);

  return router;
};

module.exports = createEstadisticaPaisRoutes;
