const express = require('express');
const router = express.Router();
const historialNoticiaController = require('../controllers/historialNoticiaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/noticia/:noticiaId', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), historialNoticiaController.listar);
router.get('/:id', verifyToken, historialNoticiaController.obtener);

module.exports = router;
