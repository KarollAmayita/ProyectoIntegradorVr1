const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { registerValidation, loginValidation, validate } = require('../../../../middlewares/validationMiddleware');
const { loginLimiter } = require('../../../../middlewares/rateLimiterMiddleware');

const createAuthRoutes = (authController) => {
  const router = express.Router();

  router.post('/login', loginLimiter, loginValidation, validate, authController.login);
  router.post('/register', registerValidation, validate, authController.register);
  router.post('/refresh-token', authController.refreshToken);
  router.post('/logout', verifyToken, authController.logout);
  router.post('/logout-all', verifyToken, authController.logoutAll);
  router.post('/session-end', authController.endSession);
  router.post('/security-question', authController.getPublicSecurityQuestion);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);
  router.put('/change-password', verifyToken, authController.changePassword);
  router.patch('/change-my-password', verifyToken, authController.changePassword);
  router.patch('/security-question', verifyToken, authController.updateSecurityQuestion);
  router.get('/security-question', verifyToken, authController.getMySecurityQuestion);
  router.get('/me', verifyToken, authController.getMyProfile);
  router.patch('/me', verifyToken, authController.updateSecurityQuestion);

  return router;
};

module.exports = createAuthRoutes;
