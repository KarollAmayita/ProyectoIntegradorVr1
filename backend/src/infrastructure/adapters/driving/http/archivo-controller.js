const createListarArchivosUseCase = require('../../../../application/use-cases/archivos/listarArchivos');
const createObtenerArchivoUseCase = require('../../../../application/use-cases/archivos/obtenerArchivo');
const createRegistrarUrlArchivoUseCase = require('../../../../application/use-cases/archivos/registrarUrlArchivo');
const createUploadArchivoUseCase = require('../../../../application/use-cases/archivos/uploadArchivo');
const createActualizarArchivoUseCase = require('../../../../application/use-cases/archivos/actualizarArchivo');
const createEliminarArchivoUseCase = require('../../../../application/use-cases/archivos/eliminarArchivo');

/**
 * @param {Function} listarArchivosUseCase
 * @param {Function} obtenerArchivoUseCase
 * @param {Function} registrarUrlArchivoUseCase
 * @param {Function} uploadArchivoUseCase
 * @param {Function} actualizarArchivoUseCase
 * @param {Function} eliminarArchivoUseCase
 */
const createHttpArchivoController = (
  listarArchivosUseCase,
  obtenerArchivoUseCase,
  registrarUrlArchivoUseCase,
  uploadArchivoUseCase,
  actualizarArchivoUseCase,
  eliminarArchivoUseCase
) => {
  return {
    listar: async (req, res) => {
      try {
        const { limit, offset, tipo, noticia_id, testimonio_id } = req.query;
        const { data, count } = await listarArchivosUseCase({
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0,
          tipo,
          noticia_id,
          testimonio_id,
          user: req.user
        });
        return res.status(200).json({ success: true, data, total: count });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    obtener: async (req, res) => {
      try {
        const archivo = await obtenerArchivoUseCase(req.params.id);
        if (!archivo) return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
        return res.status(200).json({ success: true, data: archivo });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    },

    registrarUrl: async (req, res) => {
      try {
        const archivo = await registrarUrlArchivoUseCase(req.body, req.user, req.ip);
        return res.status(201).json({ success: true, message: 'Archivo registrado', data: archivo });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    },

    upload: async (req, res) => {
      try {
        if (!req.files || !req.files.archivo) return res.status(400).json({ success: false, message: 'Archivo requerido' });
        const archivo = await uploadArchivoUseCase(req.files.archivo, req.body, req.user, req.ip);
        return res.status(201).json({ success: true, message: 'Archivo subido', data: archivo });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    },

    actualizar: async (req, res) => {
      try {
        const archivo = await actualizarArchivoUseCase(req.params.id, req.body, req.user);
        return res.status(200).json({ success: true, message: 'Archivo actualizado', data: archivo });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    },

    eliminar: async (req, res) => {
      try {
        const result = await eliminarArchivoUseCase(req.params.id, req.user, req.ip);
        return res.status(200).json(result);
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
  };
};

module.exports = createHttpArchivoController;
