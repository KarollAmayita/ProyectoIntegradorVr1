const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');

const createProfileRoutes = (profileController) => {
  const router = express.Router();

  router.get('/me', verifyToken, profileController.getProfile);

  return router;
};

module.exports = createProfileRoutes;
