const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createAdminRoutes = (adminController) => {
  const router = express.Router();

  router.get(
    '/panel',
    verifyToken,
    authorizeRoles('superadmin'),
    adminController.getAdminPanel
  );

  return router;
};

module.exports = createAdminRoutes;
