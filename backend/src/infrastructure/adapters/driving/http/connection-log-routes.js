const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createConnectionLogRoutes = (connectionLogController) => {
  const router = express.Router();

  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), connectionLogController.list);
  router.get('/summary', verifyToken, authorizeRoles('superadmin', 'admin_pais'), connectionLogController.summary);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), connectionLogController.getById);

  return router;
};

module.exports = createConnectionLogRoutes;
