class NewsRepository {
  async findAllNews() {
    throw new Error('Method not implemented');
  }
  async findNewsByCountry(pais_id) {
    throw new Error('Method not implemented');
  }
  async findPublishedNewsByCountrySlug(countrySlug) {
    throw new Error('Method not implemented');
  }
  async findPublishedNewsDetailByCountryAndSlug(countrySlug, newsSlug) {
    throw new Error('Method not implemented');
  }
  async findNewsById(id) {
    throw new Error('Method not implemented');
  }
  async createNews(newsData) {
    throw new Error('Method not implemented');
  }
  async updateNews(id, updateData) {
    throw new Error('Method not implemented');
  }
  async deleteNews(id) {
    throw new Error('Method not implemented');
  }
  async findAllIdsByPais(pais_id) {
    throw new Error('Method not implemented');
  }
}

module.exports = NewsRepository;
