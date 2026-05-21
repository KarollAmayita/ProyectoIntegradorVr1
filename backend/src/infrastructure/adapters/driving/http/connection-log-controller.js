const createHttpConnectionLogController = (
  listarConnectionLogsUseCase,
  obtenerConnectionLogUseCase,
  obtenerResumenConnectionLogUseCase
) => {
  return {
    list: async (req, res) => {
      try {
        const { limit, offset, username } = req.query;

        const params = {};
        if (limit) params.limit = parseInt(limit, 10);
        if (offset) params.offset = parseInt(offset, 10);
        if (username) params.username = username;
        params.user = req.user;

        const { data, count } = await listarConnectionLogsUseCase(params);

        return res.status(200).json({
          success: true,
          data,
          total: count,
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    getById: async (req, res) => {
      try {
        const { id } = req.params;
        const log = await obtenerConnectionLogUseCase(id);

        if (!log) {
          return res.status(404).json({ success: false, message: 'Registro no encontrado' });
        }

        return res.status(200).json({ success: true, data: log });
      } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
      }
    },

    summary: async (req, res) => {
      try {
        const data = await obtenerResumenConnectionLogUseCase();
        return res.status(200).json({ success: true, data });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },
  };
};

module.exports = createHttpConnectionLogController;
