const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Token tidak valid atau kadaluwarsa';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token tidak valid atau kadaluwarsa';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    status = 400;
  }

  res.status(status).json({
    status: err.code || status,
    message: message,
    data: null
  });
};

module.exports = errorHandler;
