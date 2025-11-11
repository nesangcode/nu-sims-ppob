const db = require('../config/database');

// Get all banners
const getBanners = async (req, res, next) => {
  try {
    // Get banners (menggunakan prepared statement - walaupun tidak ada parameter, tetap best practice)
    const [banners] = await db.execute(
      'SELECT banner_name, banner_image, description FROM banners ORDER BY id ASC'
    );

    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

// Get all services
const getServices = async (req, res, next) => {
  try {
    // Get services (menggunakan prepared statement)
    const [services] = await db.execute(
      'SELECT service_code, service_name, service_icon, service_tariff FROM services ORDER BY id ASC'
    );

    res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: services
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getServices
};
