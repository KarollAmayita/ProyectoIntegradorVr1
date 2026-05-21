const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../../middlewares/authMiddleware');
const { authorizeRoles } = require('../../../../middlewares/roleMiddleware');

const createComentarioRoutes = (comentarioController) => {
  router.get('/public/:noticiaId', comentarioController.listarPublicos);
  router.post('/public', comentarioController.crear);

  router.get('/', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), comentarioController.listar);
  router.get('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais', 'editor'), comentarioController.obtener);
  router.patch('/:id/moderar', verifyToken, authorizeRoles('superadmin', 'admin_pais'), comentarioController.moderar);
  router.delete('/:id', verifyToken, authorizeRoles('superadmin', 'admin_pais'), comentarioController.eliminar);

  return router;
};

module.exports = createComentarioRoutes;
