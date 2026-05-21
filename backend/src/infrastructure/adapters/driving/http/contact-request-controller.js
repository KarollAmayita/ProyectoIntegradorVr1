const { AppError } = require('../../../../utils/errors');

class ContactRequestController {
  constructor(contactRequestService) {
    this.contactRequestService = contactRequestService;
  }

  getRequests = async (req, res) => {
    try {
      const requests = await this.contactRequestService.getRequests(req.user);
      return res.status(200).json(requests);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  createPublicRequest = async (req, res) => {
    try {
      const request = await this.contactRequestService.createPublicRequest(req.body);
      return res.status(201).json(request);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  getRequestById = async (req, res) => {
    try {
      const { id } = req.params;
      const request = await this.contactRequestService.getRequestById(id, req.user);
      return res.status(200).json(request);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateRequestStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.contactRequestService.updateRequestStatus(id, req.body, req.user);
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  deleteRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.contactRequestService.deleteRequest(id, req.user);
      return res.status(200).json(result);
    } catch (error) {
      this._handleError(error, res);
    }
  };

  updateRequestGeneral = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.contactRequestService.updateRequestGeneral(id, req.body, req.user);
      return res.status(200).json(result);
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

module.exports = ContactRequestController;
