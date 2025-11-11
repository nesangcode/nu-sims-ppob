const swaggerJsdoc = require('swagger-jsdoc');

// Get APP_URL from environment or use default
const appUrl = process.env.APP_URL || 'http://localhost:3000';
const nodeEnv = process.env.NODE_ENV || 'development';

// Build servers array dynamically
const servers = [];

// Always add local development server for testing
servers.push({
  url: 'http://localhost:3000',
  description: 'Local Development Server'
});

// Add production/staging server if APP_URL is set and different from localhost
if (appUrl !== 'http://localhost:3000' && appUrl !== 'http://127.0.0.1:3000') {
  servers.push({
    url: appUrl,
    description: nodeEnv === 'production' ? 'Production Server (Railway)' : 'Staging Server'
  });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIMS PPOB API',
      version: '1.0.0',
      description: 'REST API untuk aplikasi SIMS PPOB - Sesuai spesifikasi Nutech',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              example: 102
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            data: {
              type: 'null',
              example: null
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@nutech-integrasi.com'
            },
            first_name: {
              type: 'string',
              example: 'User'
            },
            last_name: {
              type: 'string',
              example: 'Nutech'
            },
            profile_image: {
              type: 'string',
              nullable: true,
              example: 'https://yoururlapi.com/profile.jpeg'
            }
          }
        },
        Service: {
          type: 'object',
          properties: {
            service_code: {
              type: 'string',
              example: 'PULSA'
            },
            service_name: {
              type: 'string',
              example: 'Pulsa'
            },
            service_icon: {
              type: 'string',
              example: 'https://nutech-integrasi.app/dummy.jpg'
            },
            service_tariff: {
              type: 'number',
              example: 40000
            }
          }
        },
        Banner: {
          type: 'object',
          properties: {
            banner_name: {
              type: 'string',
              example: 'Banner 1'
            },
            banner_image: {
              type: 'string',
              example: 'https://nutech-integrasi.app/dummy.jpg'
            },
            description: {
              type: 'string',
              example: 'Lerem Ipsum Dolor sit amet'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            invoice_number: {
              type: 'string',
              example: 'INV17082023-001'
            },
            transaction_type: {
              type: 'string',
              enum: ['TOPUP', 'PAYMENT'],
              example: 'PAYMENT'
            },
            description: {
              type: 'string',
              example: 'Pulsa'
            },
            total_amount: {
              type: 'number',
              example: 40000
            },
            created_on: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-17T10:10:10.000Z'
            }
          }
        }
      }
    },
    tags: [
      {
        name: '1. Module Membership',
        description: 'Endpoints untuk registrasi, login, dan manajemen profile'
      },
      {
        name: '2. Module Information',
        description: 'Endpoints untuk informasi banner dan services'
      },
      {
        name: '3. Module Transaction',
        description: 'Endpoints untuk balance, topup, dan transaksi'
      }
    ]
  },
  apis: ['./routes/*.js'] // Path ke file routes untuk JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
