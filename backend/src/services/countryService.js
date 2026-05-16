const countryRepository = require('../repositories/countryRepository');

const getCountries = async (user) => {
  if (!user || user.rol === 'superadmin') {
    return await countryRepository.findAllCountries();
  }
  if (user.pais_id) {
    const country = await countryRepository.findCountryById(user.pais_id);
    return country ? [country] : [];
  }
  return [];
};

const getActiveCountries = async () => {
  return await countryRepository.findActiveCountries();
};

module.exports = {
  getCountries,
  getActiveCountries,
};