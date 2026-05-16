const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/contar', verifyToken, notificacionController.contar);
router.get('/', verifyToken, notificacionController.listar);
router.patch('/leer-todas', verifyToken, notificacionController.marcarTodasLeidas);
router.patch('/:id/leer', verifyToken, notificacionController.marcarLeida);

module.exports = router;
