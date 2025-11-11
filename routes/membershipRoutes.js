const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const authenticate = require('../middleware/auth');
const { validateRegistration, validateLogin, validateProfileUpdate } = require('../middleware/validator');
const multer = require('multer');
const path = require('path');

// Setup multer untuk upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

/**
 * @swagger
 * /registration:
 *   post:
 *     tags: [1. Module Membership]
 *     summary: Registration User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@nutech-integrasi.com
 *               first_name:
 *                 type: string
 *                 example: User
 *               last_name:
 *                 type: string
 *                 example: Nutech
 *               password:
 *                 type: string
 *                 minimum: 8
 *                 example: abcdef1234
 *     responses:
 *       200:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validation error
 */
router.post('/registration', validateRegistration, membershipController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [1. Module Membership]
 *     summary: Login User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@nutech-integrasi.com
 *               password:
 *                 type: string
 *                 example: abcdef1234
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Login Sukses
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       401:
 *         description: Username atau password salah
 */
router.post('/login', validateLogin, membershipController.login);

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [1. Module Membership]
 *     summary: Get Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: Sukses
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.get('/profile', authenticate, membershipController.getProfile);

/**
 * @swagger
 * /profile/update:
 *   put:
 *     tags: [1. Module Membership]
 *     summary: Update Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: User Updated
 *               last_name:
 *                 type: string
 *                 example: Nutech Updated
 *     responses:
 *       200:
 *         description: Update berhasil
 *       400:
 *         description: Validation error
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.put('/profile/update', authenticate, validateProfileUpdate, membershipController.updateProfile);

/**
 * @swagger
 * /profile/image:
 *   put:
 *     tags: [1. Module Membership]
 *     summary: Update Profile Image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png) max 5MB
 *     responses:
 *       200:
 *         description: Update berhasil
 *       400:
 *         description: Format Image tidak sesuai
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.put('/profile/image', authenticate, upload.single('file'), membershipController.updateProfileImage);

module.exports = router;
