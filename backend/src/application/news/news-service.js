const News = require('../../domain/news/news');
const { AuthenticationError, ValidationError, NotFoundError } = require('../../utils/errors');

class NewsService {
  constructor({ newsRepository, historialNoticiaPort, slugGenerator }) {
    this.newsRepository = newsRepository;
    this.historialNoticiaPort = historialNoticiaPort;
    this.slugGenerator = slugGenerator;
  }

  async getNews(user) {
    if (user.rol === 'superadmin') {
      return await this.newsRepository.findAllNews();
    }

    return await this.newsRepository.findNewsByCountry(user.pais_id);
  }

  async getPublicNewsByCountry(countrySlug) {
    if (!countrySlug) {
      throw new ValidationError('El país es obligatorio');
    }

    return await this.newsRepository.findPublishedNewsByCountrySlug(countrySlug);
  }

  async getPublicNewsDetail(countrySlug, newsSlug) {
    if (!countrySlug || !newsSlug) {
      throw new ValidationError('El país y el slug de la noticia son obligatorios');
    }

    const newsData = await this.newsRepository.findPublishedNewsDetailByCountryAndSlug(
      countrySlug,
      newsSlug
    );

    if (!newsData) {
      throw new NotFoundError('Noticia no encontrada');
    }

    return newsData;
  }

  async getNewsById(id, user) {
    const newsData = await this.newsRepository.findNewsById(id);
    if (!newsData) throw new NotFoundError('Noticia no encontrada');
    
    if (user.rol !== 'superadmin' && Number(newsData.pais_id) !== Number(user.pais_id)) {
      throw new AuthenticationError('No tiene permisos para ver esta noticia');
    }
    return newsData;
  }

  async createNews(payload, user) {
    const {
      titulo,
      resumen,
      contenido,
      imagen_principal_url,
      estado = 'borrador',
      pais_id,
    } = payload;

    if (!titulo || !resumen || !contenido) {
      throw new ValidationError('Título, resumen y contenido son obligatorios');
    }

    let finalPaisId = pais_id;

    if (user.rol !== 'superadmin') {
      finalPaisId = user.pais_id;
    }

    if (!finalPaisId) {
      throw new ValidationError('El país es obligatorio para crear una noticia');
    }

    const finalEstado = estado || 'borrador';

    const fecha_publicacion =
      finalEstado === 'publicado' ? new Date().toISOString() : null;

    const slug = this.slugGenerator(titulo);

    return await this.newsRepository.createNews({
      pais_id: finalPaisId,
      titulo,
      slug,
      resumen,
      contenido,
      imagen_principal_url: imagen_principal_url || null,
      autor_id: user.id,
      estado: finalEstado,
      fecha_publicacion,
    });
  }

  async updateNews(id, payload, user) {
    const existingNewsData = await this.newsRepository.findNewsById(id);

    if (!existingNewsData) {
      throw new NotFoundError('La noticia no existe');
    }

    if (
      user.rol !== 'superadmin' &&
      Number(existingNewsData.pais_id) !== Number(user.pais_id)
    ) {
      throw new AuthenticationError('No tiene permisos para modificar esta noticia');
    }

    const allowedFields = [
      'titulo',
      'resumen',
      'contenido',
      'imagen_principal_url',
      'estado',
    ];

    const updatePayload = {};

    allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
        updatePayload[field] = payload[field];
      }
    });

    if (payload.titulo) {
      updatePayload.slug = this.slugGenerator(payload.titulo);
    }

    if (payload.estado === 'publicado' && existingNewsData.estado !== 'publicado') {
      updatePayload.fecha_publicacion = new Date().toISOString();
    }

    if (payload.estado && payload.estado !== 'publicado') {
      updatePayload.fecha_publicacion = null;
    }

    updatePayload.updated_at = new Date().toISOString();

    // Prepare versioning/history
    if (this.historialNoticiaPort) {
      const cambios = {};
      let hayCambios = false;
      for (const key of Object.keys(updatePayload)) {
        if (existingNewsData[key] !== undefined && existingNewsData[key] !== updatePayload[key]) {
          cambios[key] = { de: existingNewsData[key], a: updatePayload[key] };
          hayCambios = true;
        }
      }
      
      if (hayCambios) {
        await this.historialNoticiaPort.registrarVersion({
          noticia_id: existingNewsData.id,
          usuario_id: user.id,
          titulo_anterior: existingNewsData.titulo,
          contenido_anterior: existingNewsData.contenido,
          estado_anterior: existingNewsData.estado,
          cambios,
        });
      }
    }

    return await this.newsRepository.updateNews(id, updatePayload);
  }

  async deleteNews(id, user) {
    const existingNewsData = await this.newsRepository.findNewsById(id);

    if (!existingNewsData) {
      throw new NotFoundError('La noticia no existe');
    }

    if (
      user.rol !== 'superadmin' &&
      Number(existingNewsData.pais_id) !== Number(user.pais_id)
    ) {
      throw new AuthenticationError('No tiene permisos para eliminar esta noticia');
    }

    if (user.rol === 'editor') {
      throw new AuthenticationError('El editor no tiene permisos para eliminar noticias');
    }

    await this.newsRepository.deleteNews(id);

    return {
      message: 'Noticia eliminada correctamente',
    };
  }

  async updateNewsStatus(id, payload, user) {
    const { estado } = payload;
    if (!estado || !['borrador', 'publicado', 'despublicado'].includes(estado)) {
      throw new ValidationError('Estado no válido');
    }
    const existing = await this.newsRepository.findNewsById(id);
    if (!existing) throw new NotFoundError('Noticia no encontrada');
    if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
      throw new AuthenticationError('No tiene permisos para modificar esta noticia');
    }
    const updatePayload = { estado, updated_at: new Date().toISOString() };
    if (estado === 'publicado' && existing.estado !== 'publicado') updatePayload.fecha_publicacion = new Date().toISOString();
    if (estado !== 'publicado') updatePayload.fecha_publicacion = null;
    return this.newsRepository.updateNews(id, updatePayload);
  }

  async updateNewsImage(id, payload, user) {
    const { imagen_principal_url } = payload;
    if (!imagen_principal_url) throw new ValidationError('URL de imagen requerida');
    const existing = await this.newsRepository.findNewsById(id);
    if (!existing) throw new NotFoundError('Noticia no encontrada');
    if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
      throw new AuthenticationError('No tiene permisos para modificar esta noticia');
    }
    return this.newsRepository.updateNews(id, { imagen_principal_url, updated_at: new Date().toISOString() });
  }
}

module.exports = NewsService;
