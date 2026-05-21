/**
 * @param {Function} listarHistorialNoticiaUseCase
 * @param {Function} obtenerHistorialNoticiaUseCase
 */
const createHttpHistorialNoticiaController = (
  listarHistorialNoticiaUseCase,
  obtenerHistorialNoticiaUseCase
) => {
  return {
    listar: async (req, res) => {
      try {
        const versiones = await listarHistorialNoticiaUseCase(req.params.noticiaId, req.user);
        return res.status(200).json({ success: true, data: versiones });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    obtener: async (req, res) => {
      try {
        const version = await obtenerHistorialNoticiaUseCase(req.params.id);
        if (!version) return res.status(404).json({ success: false, message: 'Versión no encontrada' });
        return res.status(200).json({ success: true, data: version });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  };
};

module.exports = createHttpHistorialNoticiaController;
