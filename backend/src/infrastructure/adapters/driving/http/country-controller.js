const { AppError } = require('../../../../utils/errors');

class CountryController {
  constructor(countryService) {
    this.countryService = countryService;
  }

  listCountries = async (req, res) => {
    try {
      const countries = await this.countryService.getCountries(req.user);
      return res.status(200).json(countries);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  listActiveCountries = async (req, res) => {
    try {
      const countries = await this.countryService.getActiveCountries();
      return res.status(200).json(countries);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  _handleError(error, res) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ 
        success: false, 
        message: error.message 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}

module.exports = CountryController;
