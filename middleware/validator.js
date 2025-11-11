const { body, validationResult } = require('express-validator');

// Validasi untuk registrasi
const validateRegistration = [
  body('email')
    .isEmail().withMessage('Parameter email tidak sesuai format')
    .normalizeEmail(),
  body('first_name')
    .notEmpty().withMessage('First name harus diisi')
    .trim(),
  body('last_name')
    .notEmpty().withMessage('Last name harus diisi')
    .trim(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  }
];

// Validasi untuk login
const validateLogin = [
  body('email')
    .isEmail().withMessage('Parameter email tidak sesuai format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password harus diisi')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  }
];

// Validasi untuk update profile
const validateProfileUpdate = [
  body('first_name')
    .notEmpty().withMessage('First name harus diisi')
    .trim(),
  body('last_name')
    .notEmpty().withMessage('Last name harus diisi')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  }
];

// Validasi untuk topup
const validateTopup = [
  body('top_up_amount')
    .isNumeric().withMessage('Parameter amount hanya boleh angka')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  }
];

// Validasi untuk transaction
const validateTransaction = [
  body('service_code')
    .notEmpty().withMessage('Service code harus diisi')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 102,
        message: errors.array()[0].msg,
        data: null
      });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateTopup,
  validateTransaction
};
