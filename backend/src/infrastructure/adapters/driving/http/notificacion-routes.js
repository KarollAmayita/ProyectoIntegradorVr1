const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');

/**
 * @param {Object} notificacionController
 */
const createNotificacionRoutes = (notificacionController) => {
  const router = express.Router();
  router.get('/contar', verifyToken, notificacionController.contar);
  router.get('/', verifyToken, notificacionController.listar);
  router.patch('/leer-todas', verifyToken, notificacionController.marcarTodasLeidas);
  router.patch('/:id/leer', verifyToken, notificacionController.marcarLeida);
  return router;
};

module.exports = createNotificacionRoutes;
