const createHttpEstadisticaPaisController = (
  listarEstadisticasPaisUseCase,
  obtenerEstadisticaPaisUseCase,
  crearEstadisticaPaisUseCase,
  actualizarEstadisticaPaisUseCase,
  eliminarEstadisticaPaisUseCase
) => {
  return {
    listar: async (req, res) => {
      try {
        const { pais_id } = req.query;
        const data = await listarEstadisticasPaisUseCase(pais_id || undefined, req.user);
        return res.status(200).json({ success: true, data });
      } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
    },

    obtener: async (req, res) => {
      try {
        const data = await obtenerEstadisticaPaisUseCase(req.params.id);
        return res.status(200).json({ success: true, data });
      } catch (error) { return res.status(404).json({ success: false, message: error.message }); }
    },

    crear: async (req, res) => {
      try {
        const data = await crearEstadisticaPaisUseCase(req.body);
        return res.status(201).json({ success: true, message: 'Estadística creada', data });
      } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
    },

    actualizar: async (req, res) => {
      try {
        const data = await actualizarEstadisticaPaisUseCase(req.params.id, req.body);
        return res.status(200).json({ success: true, message: 'Estadística actualizada', data });
      } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
    },

    eliminar: async (req, res) => {
      try {
        const result = await eliminarEstadisticaPaisUseCase(req.params.id);
        return res.status(200).json(result);
      } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
    }
  };
};

module.exports = createHttpEstadisticaPaisController;
