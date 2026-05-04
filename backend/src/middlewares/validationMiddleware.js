const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('Apellido es obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('username').notEmpty().withMessage('Username es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
  body('rol_id').notEmpty().withMessage('Rol es obligatorio'),
];

const loginValidation = [
  body('username').notEmpty().withMessage('Username es obligatorio'),
  body('password').notEmpty().withMessage('Contraseña es obligatoria'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate,
};