const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createContactRequestRoutes = (contactRequestController) => {
  const router = express.Router();

  router.post('/public', contactRequestController.createPublicRequest);
  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), contactRequestController.getRequests);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), contactRequestController.getRequestById);
  router.patch('/:id/status', verifyToken, authorizeRoles('superadmin', 'admin_pais'), contactRequestController.updateRequestStatus);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), contactRequestController.deleteRequest);
  router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), contactRequestController.updateRequestGeneral);

  return router;
};

module.exports = createContactRequestRoutes;
