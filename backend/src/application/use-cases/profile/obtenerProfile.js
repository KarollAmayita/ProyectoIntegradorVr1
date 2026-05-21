const createObtenerProfileUseCase = () => {
  return async (user) => {
    if (!user) {
      throw new Error('No autorizado');
    }
    return {
      success: true,
      user
    };
  };
};

module.exports = createObtenerProfileUseCase;
