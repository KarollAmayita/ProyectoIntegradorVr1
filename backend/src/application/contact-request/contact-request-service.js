const ContactRequest = require('../../domain/contact-request/contact-request');
const { ValidationError } = require('../../utils/errors');

class ContactRequestService {
  constructor({ contactRequestRepository }) {
    this.contactRequestRepository = contactRequestRepository;
  }

  async getRequests(user) {
    if (user.rol === 'superadmin') {
      return await this.contactRequestRepository.findAllRequests();
    }

    return await this.contactRequestRepository.findRequestsByCountry(user.pais_id);
  }

  async createPublicRequest(payload) {
    const {
      pais_id,
      nombre,
      correo,
      telefono,
      finalidad,
      mensaje,
    } = payload;

    if (!pais_id || !nombre || !correo || !telefono || !finalidad) {
      throw new ValidationError('País, nombre, correo, teléfono y finalidad son obligatorios');
    }

    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (!isValidEmail(correo)) {
      throw new ValidationError('El correo electrónico no tiene un formato válido');
    }

    const defaultPhotoUrl = '../../../assets/img/portales/default_avatar.png';
    const autorId = 1; 

    return await this.contactRequestRepository.createRequest({
      pais_id,
      nombre,
      correo,
      telefono,
      finalidad,
      mensaje: mensaje || null,
      estado: 'pendiente',
      autor_id: autorId,
    });
  }

  async updateRequestStatus(id, payload, user) {
    const existingRequest = await this.contactRequestRepository.findRequestById(id);

    if (!existingRequest) {
      throw new ValidationError('La solicitud no existe');
    }

    if (
      user.rol !== 'superadmin' &&
      Number(existingRequest.pais_id) !== Number(user.pais_id)
    ) {
      throw new ValidationError('No tiene permisos para gestionar esta solicitud');
    }

    const { estado, observaciones_admin } = payload;
    const allowedStates = ['pendiente', 'en_proceso', 'gestionada', 'cerrada'];

    if (!estado || !allowedStates.includes(estado)) {
      throw new ValidationError('Estado no válido');
    }

    const updatePayload = {
      estado,
      observaciones_admin: observaciones_admin || existingRequest.observaciones_admin,
      gestionado_por: user.id,
      updated_at: new Date().toISOString(),
    };

    if (estado === 'gestionada' || estado === 'cerrada') {
      updatePayload.fecha_gestion = new Date().toISOString();
    }

    return await this.contactRequestRepository.updateRequest(id, updatePayload);
  }

  async deleteRequest(id, user) {
    const existingRequest = await this.contactRequestRepository.findRequestById(id);

    if (!existingRequest) {
      throw new ValidationError('La solicitud no existe');
    }

    if (
      user.rol !== 'superadmin' &&
      Number(existingRequest.pais_id) !== Number(user.pais_id)
    ) {
      throw new ValidationError('No tiene permisos para eliminar esta solicitud');
    }

    if (user.rol === 'editor') {
      throw new ValidationError('El editor no tiene permisos para eliminar solicitudes');
    }

    await this.contactRequestRepository.deleteRequest(id);

    return {
      message: 'Solicitud eliminada correctamente',
    };
  }

  async getRequestById(id, user) {
    const request = await this.contactRequestRepository.findRequestById(id);
    if (!request) throw new ValidationError('Solicitud no encontrada');
    if (user.rol !== 'superadmin' && Number(request.pais_id) !== Number(user.pais_id)) {
      throw new ValidationError('No tiene permisos para ver esta solicitud');
    }
    return request;
  }

  async updateRequestGeneral(id, payload, user) {
    const existing = await this.contactRequestRepository.findRequestById(id);
    if (!existing) throw new ValidationError('Solicitud no encontrada');
    if (user.rol !== 'superadmin' && Number(existing.pais_id) !== Number(user.pais_id)) {
      throw new ValidationError('No tiene permisos para modificar esta solicitud');
    }
    const allowedFields = ['nombre', 'correo', 'telefono', 'finalidad', 'mensaje', 'estado', 'observaciones_admin'];
    const updatePayload = {};
    allowedFields.forEach(f => { if (payload[f] !== undefined) updatePayload[f] = payload[f]; });
    updatePayload.gestionado_por = user.id;
    updatePayload.updated_at = new Date().toISOString();
    if (updatePayload.estado === 'gestionada' || updatePayload.estado === 'cerrada') {
      updatePayload.fecha_gestion = new Date().toISOString();
    }
    return this.contactRequestRepository.updateRequest(id, updatePayload);
  }
}

module.exports = ContactRequestService;

