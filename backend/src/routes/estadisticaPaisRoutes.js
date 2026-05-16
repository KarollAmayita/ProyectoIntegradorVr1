const express = require('express');
const router = express.Router();
const estadisticaPaisController = require('../controllers/estadisticaPaisController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.listar);
router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.obtener);
router.post('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.crear);
router.put('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.actualizar);
router.patch('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.actualizar);
router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), estadisticaPaisController.eliminar);

module.exports = router;
