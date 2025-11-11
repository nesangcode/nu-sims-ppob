const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middleware/auth');
const { validateTopup, validateTransaction } = require('../middleware/validator');

/**
 * @swagger
 * /balance:
 *   get:
 *     tags: [3. Module Transaction]
 *     summary: Get Balance
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
 *                   example: Get Balance Berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 1000000
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.get('/balance', authenticate, transactionController.getBalance);

/**
 * @swagger
 * /topup:
 *   post:
 *     tags: [3. Module Transaction]
 *     summary: Top Up Balance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - top_up_amount
 *             properties:
 *               top_up_amount:
 *                 type: number
 *                 example: 1000000
 *                 description: Amount must be positive number
 *     responses:
 *       200:
 *         description: Top Up berhasil
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
 *                   example: Top Up Balance berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 2000000
 *       400:
 *         description: Validation error
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.post('/topup', authenticate, validateTopup, transactionController.topup);

/**
 * @swagger
 * /transaction:
 *   post:
 *     tags: [3. Module Transaction]
 *     summary: Transaction (Payment)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_code
 *             properties:
 *               service_code:
 *                 type: string
 *                 example: PULSA
 *                 description: Valid service code from /services
 *     responses:
 *       200:
 *         description: Transaksi berhasil
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
 *                   example: Transaksi berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_number:
 *                       type: string
 *                       example: INV17082023-001
 *                     service_code:
 *                       type: string
 *                       example: PULSA
 *                     service_name:
 *                       type: string
 *                       example: Pulsa
 *                     transaction_type:
 *                       type: string
 *                       example: PAYMENT
 *                     total_amount:
 *                       type: number
 *                       example: 40000
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Service tidak ditemukan atau saldo tidak cukup
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.post('/transaction', authenticate, validateTransaction, transactionController.createTransaction);

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     tags: [3. Module Transaction]
 *     summary: Transaction History
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Starting position
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records to return (optional, default all)
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
 *                   example: Get History Berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       example: 3
 *                     records:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Token tidak valid atau kadaluwarsa
 */
router.get('/transaction/history', authenticate, transactionController.getTransactionHistory);

module.exports = router;
