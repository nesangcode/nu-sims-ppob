const mysql = require('mysql2');
require('dotenv').config();

// Buat connection pool untuk performa yang lebih baik
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sims_ppob',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Gunakan promise untuk async/await
const promisePool = pool.promise();

// Test koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Database connected successfully');
  connection.release();
});

module.exports = promisePool;
