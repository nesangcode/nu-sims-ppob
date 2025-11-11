const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak valid atau kadaluwarsa',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Simpan user data di request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak valid atau kadaluwarsa',
      data: null
    });
  }
};

module.exports = authenticate;
