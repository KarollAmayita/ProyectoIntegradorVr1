const Country = require('../../domain/country/country');

class CountryService {
  constructor({ countryRepository }) {
    this.countryRepository = countryRepository;
  }

  async getCountries(user) {
    if (!user || user.rol === 'superadmin') {
      const countries = await this.countryRepository.findAllCountries();
      return countries.map(c => new Country(c));
    }
    
    if (user.pais_id) {
      const countryData = await this.countryRepository.findCountryById(user.pais_id);
      return countryData ? [new Country(countryData)] : [];
    }
    
    return [];
  }

  async getActiveCountries() {
    const countries = await this.countryRepository.findActiveCountries();
    return countries.map(c => new Country(c));
  }
}

module.exports = CountryService;
