jest.mock('../../src/config/supabase', () => require('../mocks/supabase'));
jest.mock('../../src/services/historialNoticiaService');

const newsService = require('../../src/services/newsService');
const newsRepository = require('../../src/repositories/newsRepository');

const mockNews = {
  id: 1,
  pais_id: 1,
  titulo: 'Noticia Test',
  slug: 'noticia-test',
  resumen: 'Resumen',
  contenido: 'Contenido',
  estado: 'borrador',
  autor_id: 1,
};

const superadminUser = { id: 1, rol: 'superadmin', pais_id: null };
const adminUser = { id: 2, rol: 'admin_pais', pais_id: 1 };
const editorUser = { id: 3, rol: 'editor', pais_id: 1 };
const otherAdmin = { id: 4, rol: 'admin_pais', pais_id: 2 };

describe('newsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNews', () => {
    it('should return all news for superadmin', async () => {
      newsRepository.findAllNews = jest.fn().mockResolvedValue([mockNews]);
      const result = await newsService.getNews(superadminUser);
      expect(newsRepository.findAllNews).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should filter by country for admin_pais', async () => {
      newsRepository.findNewsByCountry = jest.fn().mockResolvedValue([mockNews]);
      const result = await newsService.getNews(adminUser);
      expect(newsRepository.findNewsByCountry).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
    });

    it('should filter by country for editor', async () => {
      newsRepository.findNewsByCountry = jest.fn().mockResolvedValue([mockNews]);
      const result = await newsService.getNews(editorUser);
      expect(newsRepository.findNewsByCountry).toHaveBeenCalledWith(1);
    });
  });

  describe('createNews', () => {
    it('should require titulo, resumen, contenido', async () => {
      await expect(newsService.createNews({}, superadminUser)).rejects.toThrow('obligatorios');
    });

    it('should create news for superadmin with provided pais_id', async () => {
      newsRepository.createNews = jest.fn().mockResolvedValue(mockNews);
      const result = await newsService.createNews(
        { titulo: 'Test', resumen: 'R', contenido: 'C', pais_id: 1 },
        superadminUser,
      );
      expect(newsRepository.createNews).toHaveBeenCalled();
      expect(result.titulo).toBe('Noticia Test');
    });

    it('should force own pais_id for admin_pais', async () => {
      newsRepository.createNews = jest.fn().mockResolvedValue(mockNews);
      await newsService.createNews(
        { titulo: 'Test', resumen: 'R', contenido: 'C', pais_id: 99 },
        adminUser,
      );
      const call = newsRepository.createNews.mock.calls[0][0];
      expect(call.pais_id).toBe(1);
    });
  });

  describe('updateNews', () => {
    it('should throw if news not found', async () => {
      newsRepository.findNewsById = jest.fn().mockResolvedValue(null);
      await expect(newsService.updateNews(999, {}, superadminUser)).rejects.toThrow('no existe');
    });

    it('should throw if admin tries to update other country news', async () => {
      newsRepository.findNewsById = jest.fn().mockResolvedValue({ ...mockNews, pais_id: 2 });
      await expect(newsService.updateNews(1, { titulo: 'Nuevo' }, adminUser)).rejects.toThrow('No tiene permisos');
    });

    it('should update superadmin news', async () => {
      newsRepository.findNewsById = jest.fn().mockResolvedValue(mockNews);
      newsRepository.updateNews = jest.fn().mockResolvedValue({ ...mockNews, titulo: 'Actualizado' });
      const result = await newsService.updateNews(1, { titulo: 'Actualizado' }, superadminUser);
      expect(result.titulo).toBe('Actualizado');
    });
  });

  describe('deleteNews', () => {
    it('should prevent editor from deleting', async () => {
      newsRepository.findNewsById = jest.fn().mockResolvedValue(mockNews);
      await expect(newsService.deleteNews(1, editorUser)).rejects.toThrow('editor no tiene permisos');
    });

    it('should allow superadmin to delete', async () => {
      newsRepository.findNewsById = jest.fn().mockResolvedValue(mockNews);
      newsRepository.deleteNews = jest.fn().mockResolvedValue();
      const result = await newsService.deleteNews(1, superadminUser);
      expect(result.message).toContain('eliminada');
    });
  });

  describe('updateNewsStatus', () => {
    it('should reject invalid status', async () => {
      await expect(newsService.updateNewsStatus(1, { estado: 'invalido' }, superadminUser)).rejects.toThrow('Estado no válido');
    });

    it('should accept valid status', async () => {
      newsRepository.findNewsById = jest.fn().mockResolvedValue(mockNews);
      newsRepository.updateNews = jest.fn().mockResolvedValue({ ...mockNews, estado: 'publicado' });
      const result = await newsService.updateNewsStatus(1, { estado: 'publicado' }, superadminUser);
      expect(result.estado).toBe('publicado');
    });
  });
});
