const createObtenerPanelAdminUseCase = () => {
  return async (user) => {
    return {
      message: 'Acceso permitido al panel administrativo',
      user
    };
  };
};

module.exports = createObtenerPanelAdminUseCase;
