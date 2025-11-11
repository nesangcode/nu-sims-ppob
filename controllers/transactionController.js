const db = require('../config/database');
const { generateInvoiceNumber } = require('../utils/helpers');

// Get balance
const getBalance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get balance (menggunakan prepared statement)
    const [balances] = await db.execute(
      'SELECT balance FROM balances WHERE user_id = ?',
      [userId]
    );

    if (balances.length === 0) {
      return res.status(404).json({
        status: 108,
        message: 'Balance tidak ditemukan',
        data: null
      });
    }

    res.status(200).json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: {
        balance: parseFloat(balances[0].balance)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Topup balance
const topup = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    const userId = req.user.id;
    const { top_up_amount } = req.body;

    // Start transaction
    await connection.beginTransaction();

    // Get current balance (menggunakan prepared statement dengan FOR UPDATE untuk locking)
    const [balances] = await connection.execute(
      'SELECT balance FROM balances WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    if (balances.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 108,
        message: 'Balance tidak ditemukan',
        data: null
      });
    }

    const currentBalance = parseFloat(balances[0].balance);
    const newBalance = currentBalance + parseFloat(top_up_amount);

    // Update balance (menggunakan prepared statement)
    await connection.execute(
      'UPDATE balances SET balance = ? WHERE user_id = ?',
      [newBalance, userId]
    );

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Insert transaction record (menggunakan prepared statement)
    await connection.execute(
      'INSERT INTO transactions (invoice_number, user_id, transaction_type, total_amount) VALUES (?, ?, ?, ?)',
      [invoiceNumber, userId, 'TOPUP', top_up_amount]
    );

    // Commit transaction
    await connection.commit();

    res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: newBalance
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Create transaction (payment)
const createTransaction = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    const userId = req.user.id;
    const { service_code } = req.body;

    // Start transaction
    await connection.beginTransaction();

    // Get service (menggunakan prepared statement)
    const [services] = await connection.execute(
      'SELECT id, service_name, service_tariff FROM services WHERE service_code = ?',
      [service_code]
    );

    if (services.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 102,
        message: 'Service atau Layanan tidak ditemukan',
        data: null
      });
    }

    const service = services[0];
    const serviceTariff = parseFloat(service.service_tariff);

    // Get current balance (menggunakan prepared statement dengan FOR UPDATE)
    const [balances] = await connection.execute(
      'SELECT balance FROM balances WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    if (balances.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 108,
        message: 'Balance tidak ditemukan',
        data: null
      });
    }

    const currentBalance = parseFloat(balances[0].balance);

    // Cek apakah saldo cukup
    if (currentBalance < serviceTariff) {
      await connection.rollback();
      return res.status(400).json({
        status: 102,
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    const newBalance = currentBalance - serviceTariff;

    // Update balance (menggunakan prepared statement)
    await connection.execute(
      'UPDATE balances SET balance = ? WHERE user_id = ?',
      [newBalance, userId]
    );

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Insert transaction record (menggunakan prepared statement)
    const [result] = await connection.execute(
      'INSERT INTO transactions (invoice_number, user_id, service_id, transaction_type, total_amount) VALUES (?, ?, ?, ?, ?)',
      [invoiceNumber, userId, service.id, 'PAYMENT', serviceTariff]
    );

    // Get transaction data untuk response
    const [transactions] = await connection.execute(
      'SELECT invoice_number, transaction_type as transaction_type, total_amount, created_on FROM transactions WHERE id = ?',
      [result.insertId]
    );

    // Commit transaction
    await connection.commit();

    const transaction = transactions[0];

    res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: transaction.invoice_number,
        service_code: service_code,
        service_name: service.service_name,
        transaction_type: transaction.transaction_type,
        total_amount: parseFloat(transaction.total_amount),
        created_on: transaction.created_on
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Get transaction history
const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 0;

    // Build query dengan LIMIT dan OFFSET sebagai literal (sudah di-validate sebagai integer)
    let query = `
      SELECT 
        t.invoice_number,
        t.transaction_type,
        s.service_code,
        s.service_name,
        t.total_amount,
        t.created_on
      FROM transactions t
      LEFT JOIN services s ON t.service_id = s.id
      WHERE t.user_id = ?
      ORDER BY t.created_on DESC
    `;

    // Add limit and offset if provided (safe karena sudah parseInt)
    if (limit > 0) {
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    // Get transaction history (menggunakan prepared statement untuk userId)
    const [transactions] = await db.execute(query, [userId]);

    // Format response
    const formattedTransactions = transactions.map(t => ({
      invoice_number: t.invoice_number,
      transaction_type: t.transaction_type,
      description: t.service_name || 'Top Up balance',
      total_amount: parseFloat(t.total_amount),
      created_on: t.created_on
    }));

    res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: offset,
        limit: limit,
        records: formattedTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBalance,
  topup,
  createTransaction,
  getTransactionHistory
};
