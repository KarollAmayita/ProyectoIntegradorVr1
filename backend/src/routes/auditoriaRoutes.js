const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), auditoriaController.listar);
router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), auditoriaController.obtener);

module.exports = router;
