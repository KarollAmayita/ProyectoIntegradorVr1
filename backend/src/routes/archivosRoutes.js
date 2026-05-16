const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivosController.listar);
router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivosController.obtener);
router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivosController.registrarUrl);
router.post('/upload', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivosController.upload);
router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivosController.actualizar);
router.patch('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), archivosController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), archivosController.eliminar);

module.exports = router;
