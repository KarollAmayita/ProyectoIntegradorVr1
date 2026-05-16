const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), categoriaController.listar);
router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), categoriaController.obtener);
router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), categoriaController.crear);
router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), categoriaController.actualizar);
router.patch('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), categoriaController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), categoriaController.eliminar);

module.exports = router;
