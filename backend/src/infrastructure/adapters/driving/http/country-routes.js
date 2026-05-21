const express = require('express');
const { verifyToken } = require('../../../../middlewares/authMiddleware');

const createCountryRoutes = (countryController) => {
  const router = express.Router();

  router.get('/active', countryController.listActiveCountries);
  router.get('/', verifyToken, countryController.listCountries);

  return router;
};

module.exports = createCountryRoutes;
