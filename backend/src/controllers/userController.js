const userService = require('../services/userService');

const listUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { nueva_password } = req.body;

    await userService.updatePassword(id, nueva_password);

    return res.status(200).json({
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    return res.status(200).json({ message: 'Usuario actualizado correctamente', data: user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const result = await userService.deactivateUser(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUserPermanent = async (req, res) => {
  try {
    const result = await userService.deleteUserPermanent(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listUsers,
  createUser,
  updatePassword,
  updateUser,
  deactivateUser,
  deleteUserPermanent,
};