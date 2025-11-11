const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const membershipRoutes = require('./routes/membershipRoutes');
const informationRoutes = require('./routes/informationRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Buat folder uploads jika belum ada
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files untuk uploads
app.use('/uploads', express.static(uploadsDir));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SIMS PPOB API Documentation'
}));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 0,
    message: 'SIMS PPOB API is running',
    data: null
  });
});

// API Routes
app.use('/', membershipRoutes);
app.use('/', informationRoutes);
app.use('/', transactionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint tidak ditemukan',
    data: null
  });
});

// Error handler middleware (harus di paling akhir)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Swagger API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health Check: http://localhost:${PORT}/`);
});

module.exports = app;
