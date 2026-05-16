const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.listUsers
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.createUser
);

router.put(
  '/:id/password',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.updatePassword
);

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  userController.updateUser
);

router.patch(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin', 'admin_pais', 'editor'),
  userController.updateUser
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.deactivateUser
);

router.delete(
  '/:id/permanent',
  verifyToken,
  authorizeRoles('superadmin'),
  userController.deleteUserPermanent
);

module.exports = router;