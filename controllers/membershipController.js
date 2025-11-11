const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// Registrasi user baru
const register = async (req, res, next) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // Cek apakah email sudah terdaftar (menggunakan prepared statement)
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 102,
        message: 'Email sudah terdaftar',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru (menggunakan prepared statement)
    const [result] = await db.execute(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email, first_name, last_name, hashedPassword]
    );

    // Buat balance awal untuk user (menggunakan prepared statement)
    await db.execute(
      'INSERT INTO balances (user_id, balance) VALUES (?, ?)',
      [result.insertId, 0]
    );

    res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email (menggunakan prepared statement)
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '12h' }
    );

    res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: {
        token: token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user data (menggunakan prepared statement)
    const [users] = await db.execute(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 108,
        message: 'User tidak ditemukan',
        data: null
      });
    }

    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name } = req.body;

    // Update profile (menggunakan prepared statement)
    await db.execute(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [first_name, last_name, userId]
    );

    // Get updated user data
    const [users] = await db.execute(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      status: 0,
      message: 'Update Profile berhasil',
      data: users[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update profile image
const updateProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }

    // Validasi file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Hapus file yang sudah diupload
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }

    // Get old profile image
    const [users] = await db.execute(
      'SELECT profile_image FROM users WHERE id = ?',
      [userId]
    );

    // Hapus old image jika ada
    if (users[0].profile_image) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(users[0].profile_image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update profile image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    await db.execute(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [imageUrl, userId]
    );

    // Get updated user data
    const [updatedUsers] = await db.execute(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: updatedUsers[0]
    });
  } catch (error) {
    // Hapus file jika ada error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
};
