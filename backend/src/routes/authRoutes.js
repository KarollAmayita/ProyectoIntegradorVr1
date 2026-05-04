const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { registerValidation, loginValidation, validate } = require('../middlewares/validationMiddleware');

router.post('/login', loginValidation, validate, authController.login);
router.post('/register', registerValidation, validate, authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);
router.post('/logout-all', verifyToken, authController.logoutAll);

module.exports = router;