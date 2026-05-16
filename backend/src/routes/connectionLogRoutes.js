const express = require('express');
const router = express.Router();
const connectionLogController = require('../controllers/connectionLogController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais'), connectionLogController.list);
router.get('/summary', verifyToken, authorizeRoles('superadmin', 'admin_pais'), connectionLogController.summary);
router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), connectionLogController.getById);

module.exports = router;
