const { AppError } = require('../../../../utils/errors');

class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
  }

  getNews = async (req, res) => {
    try {
      const news = await this.newsService.getNews(req.user);
      return res.status(200).json(news);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getPublicNewsByCountry = async (req, res) => {
    try {
      const { countrySlug } = req.params;
      const news = await this.newsService.getPublicNewsByCountry(countrySlug);
      return res.status(200).json(news);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getPublicNewsDetail = async (req, res) => {
    try {
      const { countrySlug, newsSlug } = req.params;
      const news = await this.newsService.getPublicNewsDetail(countrySlug, newsSlug);
      return res.status(200).json(news);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getNewsById = async (req, res) => {
    try {
      const { id } = req.params;
      const news = await this.newsService.getNewsById(id, req.user);
      return res.status(200).json(news);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  createNews = async (req, res) => {
    try {
      const news = await this.newsService.createNews(req.body, req.user);
      return res.status(201).json({
        message: 'Noticia creada correctamente',
        data: news,
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateNews = async (req, res) => {
    try {
      const { id } = req.params;
      const news = await this.newsService.updateNews(id, req.body, req.user);
      return res.status(200).json({
        message: 'Noticia actualizada correctamente',
        data: news,
      });
    } catch (error) {
      this._handleError(error, res);
    }
  };

  deleteNews = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.newsService.deleteNews(id, req.user);
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateNewsStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const news = await this.newsService.updateNewsStatus(id, req.body, req.user);
      return res.status(200).json(news);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateNewsImage = async (req, res) => {
    try {
      const { id } = req.params;
      const news = await this.newsService.updateNewsImage(id, req.body, req.user);
      return res.status(200).json(news);
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

module.exports = NewsController;
