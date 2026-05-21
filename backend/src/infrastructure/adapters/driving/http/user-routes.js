const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createUserRoutes = (userController) => {
  const router = express.Router();

  router.get('/', verifyToken, authorizeRoles('superadmin'), userController.listUsers);
  router.post('/', verifyToken, authorizeRoles('superadmin'), userController.createUser);
  router.put('/:id/password', verifyToken, authorizeRoles('superadmin'), userController.updatePassword);
  router.put('/:id', verifyToken, authorizeRoles('superadmin'), userController.updateUser);
  router.patch('/:id', verifyToken, authorizeRoles('superadmin'), userController.updateUser);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin'), userController.deactivateUser);
  router.delete('/:id/permanent', verifyToken, authorizeRoles('superadmin'), userController.deleteUserPermanent);

  return router;
};

module.exports = createUserRoutes;
