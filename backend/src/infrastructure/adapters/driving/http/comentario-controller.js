const createListarComentariosUseCase = require('../../../../application/use-cases/comentario/listarComentarios');
const createListarComentariosPublicosUseCase = require('../../../../application/use-cases/comentario/listarComentariosPublicos');
const createObtenerComentarioUseCase = require('../../../../application/use-cases/comentario/obtenerComentario');
const createCrearComentarioUseCase = require('../../../../application/use-cases/comentario/crearComentario');
const createModerarComentarioUseCase = require('../../../../application/use-cases/comentario/moderarComentario');
const createEliminarComentarioUseCase = require('../../../../application/use-cases/comentario/eliminarComentario');

const createHttpComentarioController = (
  listarComentariosUseCase,
  listarComentariosPublicosUseCase,
  obtenerComentarioUseCase,
  crearComentarioUseCase,
  moderarComentarioUseCase,
  eliminarComentarioUseCase
) => {
  return {
    listar: async (req, res) => {
      try {
        const { limit, offset, estado, noticia_id } = req.query;
        const { data, count } = await listarComentariosUseCase({
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0,
          estado: estado || undefined,
          noticia_id: noticia_id || undefined,
          user: req.user
        });
        return res.status(200).json({ success: true, data, total: count });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    listarPublicos: async (req, res) => {
      try {
        const { limit, offset } = req.query;
        const { data, count } = await listarComentariosPublicosUseCase(req.params.noticiaId, {
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0
        });
        return res.status(200).json({ success: true, data, total: count });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    obtener: async (req, res) => {
      try {
        const data = await obtenerComentarioUseCase(req.params.id);
        return res.status(200).json({ success: true, data });
      } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
      }
    },

    crear: async (req, res) => {
      try {
        const data = await crearComentarioUseCase(req.body);
        return res.status(201).json({ success: true, message: 'Comentario enviado. Pendiente de moderación.', data });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    },

    moderar: async (req, res) => {
      try {
        const { estado } = req.body;
        const data = await moderarComentarioUseCase(req.params.id, estado, req.user);
        return res.status(200).json({ success: true, message: 'Comentario moderado', data });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    },

    eliminar: async (req, res) => {
      try {
        const result = await eliminarComentarioUseCase(req.params.id, req.user);
        return res.status(200).json(result);
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  };
};

module.exports = createHttpComentarioController;
