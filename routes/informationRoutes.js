const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const authenticate = require('../middleware/auth');

/**
 * @swagger
 * /banner:
 *   get:
 *     tags: [2. Module Information]
 *     summary: Get Banner
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */
router.get('/banner', informationController.getBanners);

/**
 * @swagger
 * /services:
 *   get:
 *     tags: [2. Module Information]
 *     summary: Get Services
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.get('/services', authenticate, informationController.getServices);

module.exports = router;
