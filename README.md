# SIMS PPOB REST API

REST API untuk aplikasi SIMS PPOB (Pulsa, Paket Data, dan Pembayaran Online) menggunakan ExpressJS dengan implementasi raw query dan prepared statements.

## 📑 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Testing API](#testing-api)
- [Security Best Practices](#security-best-practices)
- [Database Schema](#database-schema)
- [Limitations & Known Issues](#limitations--known-issues)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Module Membership**: Registration, Login, Profile Management
- **Module Information**: Banners and Services
- **Module Transaction**: Balance, Top Up, Payment, Transaction History
- **Security**: JWT Authentication, Password Hashing (bcrypt)
- **Database**: MySQL with Raw Query & Prepared Statements
- **Validation**: Input validation using express-validator
- **Error Handling**: Centralized error handling
- **File Upload**: Profile image upload with validation
- **Swagger UI**: Interactive API documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd nu-sims-ppob
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Create MySQL database and import schema:

```bash
mysql -u root -p < database/schema.sql
```

Or run SQL queries in `database/schema.sql` manually.

### 4. Environment Configuration

Copy `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` file according to your configuration:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sims_ppob

JWT_SECRET=your-super-secret-jwt-key

APP_URL=http://localhost:3000
```

### 5. Run Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will run at `http://localhost:3000`

### 6. Access Swagger UI

After server is running, open browser and access:

```
http://localhost:3000/api-docs
```

Swagger UI provides:
- Complete documentation of all endpoints
- Interface for testing API directly from browser
- Clear request/response schemas
- Authorization feature for protected endpoints
- **Dynamic server selection** - switches between local and production environments

**Server Configuration:**
- Swagger automatically shows available servers based on `APP_URL` environment variable
- **Local development:** Shows `http://localhost:3000`
- **Production deployment:** Shows both localhost and your production URL (e.g., Railway)
- Use the server dropdown in Swagger UI to switch between environments

📖 **Setup Guide:** [SWAGGER_SETUP.md](./SWAGGER_SETUP.md) - Complete instructions for configuring production URL

## API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format

All responses use standard JSON format:

```json
{
  "status": 0,
  "message": "Sukses",
  "data": {}
}
```

Status Codes:
- `0`: Success
- `102`: Bad Request / Validation Error
- `103`: Authentication Failed
- `108`: Unauthorized / Token Invalid

---

## Module Membership

### 1. Registration

**Endpoint:** `POST /registration`

**Request Body:**
```json
{
  "email": "user@nutech-integrasi.com",
  "first_name": "User",
  "last_name": "Nutech",
  "password": "abcdef1234"
}
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Registrasi berhasil silahkan login",
  "data": null
}
```

### 2. Login

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "user@nutech-integrasi.com",
  "password": "abcdef1234"
}
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Login Sukses",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile

**Endpoint:** `GET /profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Sukses",
  "data": {
    "email": "user@nutech-integrasi.com",
    "first_name": "User",
    "last_name": "Nutech",
    "profile_image": "https://yoururlapi.com/profile.jpeg"
  }
}
```

### 4. Update Profile

**Endpoint:** `PUT /profile/update`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "first_name": "User Updated",
  "last_name": "Nutech Updated"
}
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Update Profile berhasil",
  "data": {
    "email": "user@nutech-integrasi.com",
    "first_name": "User Updated",
    "last_name": "Nutech Updated",
    "profile_image": "https://yoururlapi.com/profile.jpeg"
  }
}
```

### 5. Update Profile Image

**Endpoint:** `PUT /profile/image`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: <image file> (jpeg, jpg, png)
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Update Profile Image berhasil",
  "data": {
    "email": "user@nutech-integrasi.com",
    "first_name": "User",
    "last_name": "Nutech",
    "profile_image": "https://yoururlapi.com/profile.jpeg"
  }
}
```

---

## Module Information

### 1. Get Banners

**Endpoint:** `GET /banner`

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Sukses",
  "data": [
    {
      "banner_name": "Banner 1",
      "banner_image": "https://nutech-integrasi.app/dummy.jpg",
      "description": "Lerem Ipsum Dolor sit amet"
    }
  ]
}
```

### 2. Get Services

**Endpoint:** `GET /services`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Sukses",
  "data": [
    {
      "service_code": "PAJAK",
      "service_name": "Pajak PBB",
      "service_icon": "https://nutech-integrasi.app/dummy.jpg",
      "service_tariff": 40000
    }
  ]
}
```

---

## Module Transaction

### 1. Get Balance

**Endpoint:** `GET /balance`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Get Balance Berhasil",
  "data": {
    "balance": 1000000
  }
}
```

### 2. Top Up

**Endpoint:** `POST /topup`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "top_up_amount": 1000000
}
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Top Up Balance berhasil",
  "data": {
    "balance": 2000000
  }
}
```

### 3. Transaction (Payment)

**Endpoint:** `POST /transaction`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_code": "PULSA"
}
```

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Transaksi berhasil",
  "data": {
    "invoice_number": "INV17082023-001",
    "service_code": "PULSA",
    "service_name": "Pulsa",
    "transaction_type": "PAYMENT",
    "total_amount": 40000,
    "created_on": "2023-08-17T10:10:10.000Z"
  }
}
```

### 4. Transaction History

**Endpoint:** `GET /transaction/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Parameter Query:**
- `offset` (optional): Starting position (default: 0)
- `limit` (optional): Number of records (default: all)

**Contoh:** `GET /transaction/history?offset=0&limit=3`

**Response Sukses (200):**
```json
{
  "status": 0,
  "message": "Get History Berhasil",
  "data": {
    "offset": 0,
    "limit": 3,
    "records": [
      {
        "invoice_number": "INV17082023-001",
        "transaction_type": "TOPUP",
        "description": "Top Up balance",
        "total_amount": 1000000,
        "created_on": "2023-08-17T10:10:10.000Z"
      }
    ]
  }
}
```

---

## Struktur Project

```
nu-sims-ppob/
├── config/
│   └── database.js          # Database connection dengan prepared statements
├── controllers/
│   ├── membershipController.js    # Logic untuk membership
│   ├── informationController.js   # Logic untuk information
│   └── transactionController.js   # Logic untuk transaction
├── database/
│   └── schema.sql           # Database schema
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handler
│   └── validator.js         # Input validation
├── routes/
│   ├── membershipRoutes.js  # Routes untuk membership
│   ├── informationRoutes.js # Routes untuk information
│   └── transactionRoutes.js # Routes untuk transaction
├── uploads/                 # Folder untuk uploaded files
├── utils/
│   └── helpers.js           # Helper functions
├── .env.example             # Environment variables template
├── .gitignore
├── index.js                 # Entry point aplikasi
├── package.json
└── README.md
```

---

## Deployment

Untuk backend API Node.js, disarankan menggunakan platform berikut:
- **Railway** (Recommended)
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2/Elastic Beanstalk**
- **Google Cloud Run**

### Alternative 1: Deploy to Railway (Recommended)

Railway is a very easy platform for deploying Node.js API.

#### Langkah-langkah:

1. **Buat akun di Railway**
   - Kunjungi https://railway.app/
   - Sign up dengan GitHub

2. **Install Railway CLI** (Optional)
   ```bash
   npm install -g @railway/cli
   ```

3. **Buat file `railway.json`**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

4. **Deploy melalui GitHub**
   - Push repository ke GitHub
   - Di Railway dashboard, klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda
   - Railway akan otomatis detect dan deploy

5. **Setup Environment Variables**
   Di Railway dashboard, tambahkan environment variables:
   ```
   DB_HOST=<your-db-host>
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_NAME=sims_ppob
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   ```

6. **Setup Database**
   - Railway menyediakan MySQL plugin
   - Atau gunakan external database (PlanetScale, AWS RDS, dll)

7. **Domain**
   Railway akan memberikan domain otomatis: `https://your-app.up.railway.app`

### Alternative 2: Deploy to Heroku

#### Langkah-langkah:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login ke Heroku**
   ```bash
   heroku login
   ```

3. **Buat aplikasi baru**
   ```bash
   heroku create your-app-name
   ```

4. **Tambahkan MySQL Add-on**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

5. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Setup Database**
   ```bash
   heroku run bash
   # Kemudian jalankan SQL schema
   ```

### Alternative 3: Deploy to DigitalOcean App Platform

1. **Buat akun di DigitalOcean**
2. **Buat App dari GitHub repository**
3. **Setup database (Managed MySQL)**
4. **Configure environment variables**
5. **Deploy otomatis dari GitHub**

---

## Testing API

### Postman Collection (Recommended)

**🎉 Automated Testing dengan Random Email Generation!**

Collection Postman sudah dilengkapi dengan:
- ✅ **100% Test Coverage** - Semua 12 endpoints memiliki automated tests
- ✅ Random email generation - bisa run berkali-kali tanpa conflict
- ✅ Automated token management
- ✅ Comprehensive test assertions untuk validasi response
- ✅ Balance tracking dan state management otomatis

**Quick Start:**
```bash
1. Import postman_collection.json ke Postman
2. Set base_url = http://localhost:3000
3. Run collection - email otomatis di-generate
4. Lihat test results di Test Results tab
```

📖 **Panduan lengkap:** [POSTMAN_TESTING.md](./POSTMAN_TESTING.md)

### Alternative Testing Tools

- **Thunder Client**: VSCode extension
- **cURL**: Command line
- **Swagger UI**: Interactive API documentation

### Contoh Testing dengan cURL:

**Registration:**
```bash
curl -X POST http://localhost:3000/registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Security Best Practices

**Implemented:**
- Password hashing dengan bcrypt
- JWT authentication
- Input validation
- SQL injection prevention (prepared statements)
- Error handling yang proper
- CORS configuration

**Recommended for Production:**
- Rate limiting (gunakan `express-rate-limit`)
- Helmet.js untuk security headers
- HTTPS/SSL certificate
- Environment-specific configurations
- Logging (Winston, Morgan)
- API versioning
- Request timeout handling
- Database connection pooling (sudah implemented)

---

## Error Handling

API uses centralized error handling with standard response format:

**Validation Error (400):**
```json
{
  "status": 102,
  "message": "Parameter email tidak sesuai format",
  "data": null
}
```

**Authentication Error (401):**
```json
{
  "status": 108,
  "message": "Token tidak valid atau kadaluwarsa",
  "data": null
}
```

**Not Found (404):**
```json
{
  "status": 404,
  "message": "Endpoint tidak ditemukan",
  "data": null
}
```

**Internal Server Error (500):**
```json
{
  "status": 500,
  "message": "Internal server error",
  "data": null
}
```

---

## Database Design

### Tables:

1. **users**: Stores user data
2. **balances**: Stores user balance (one-to-one with users)
3. **services**: Stores available services
4. **banners**: Stores banner information
5. **transactions**: Stores transaction history

### Key Features:
- Foreign key constraints
- Indexes on frequently queried columns
- Prepared statements for security
- Transactions with FOR UPDATE for race condition prevention

---

## Limitations & Known Issues

This application is a **proof-of-concept/take-home test implementation**. Below are documented limitations and areas for improvement before production deployment.

### ⚡ Quick Overview

| Category | Key Limitations |
|----------|----------------|
| **Postman** | Manual file selection required for image upload |
| **Database** | No migration system, separate schemas for local/Railway |
| **Security** | No rate limiting, token refresh, or 2FA |
| **Performance** | No caching, single-instance only, local file storage |
| **Testing** | No unit/integration tests, only Postman collection |
| **Monitoring** | Basic console logging only, no APM or error tracking |

### 🔸 Postman Testing

**Manual File Selection Required for Image Upload:**
- The "Update Profile Image" endpoint requires **manual file selection** in Postman
- Postman collections cannot auto-attach files due to security restrictions
- **Workaround:** Manually select `testphoto.jpg` before sending request
  1. Open "Update Profile Image" request
  2. Go to Body → form-data
  3. Click "Select Files" for the `file` key
  4. Select `testphoto.jpg` from repository root
- **Error if not done:** `"Format Image tidak sesuai"` (Status 102)

### 🔸 Database

**Schema Differences for Local vs Railway:**
- **Local development**: Uses database name `sims_ppob` (`schema.sql`)
- **Railway deployment**: Uses database name `railway` (`schema-railway.sql`)
- Must use correct schema file for each environment
- No automatic database migration system implemented

**Transaction Limitations:**
- Race condition prevention uses `FOR UPDATE` locks
- High concurrent transactions may experience delays
- No distributed transaction support

**Data Constraints:**
- Balance stored as `DECIMAL(15,2)` - max 13 digits before decimal
- Invoice numbers use simple timestamp-based generation (potential collision in high-load)
- No soft delete implementation - records are permanently deleted

### 🔸 Security

**Authentication:**
- JWT tokens don't have automatic refresh mechanism
- Tokens expire based on JWT_SECRET configuration
- No session management or token revocation list
- No rate limiting implemented (vulnerable to brute force)

**File Upload:**
- Image validation only checks MIME type (can be spoofed)
- No virus/malware scanning on uploaded files
- Max file size: 5MB (hardcoded, not configurable)
- Uploaded files stored locally (not cloud storage)

**Password:**
- Minimum 8 characters required
- No complexity requirements (uppercase, numbers, special chars)
- No password history tracking
- No account lockout after failed attempts

### 🔸 Performance

**Query Optimization:**
- No caching layer implemented (Redis/Memcached)
- All queries hit database directly
- No query result pagination on some endpoints
- Connection pooling limited to 10 connections

**File Storage:**
- Profile images stored on local filesystem
- No CDN integration
- Images served directly by Node.js (not optimized)
- No image optimization/compression

**Scalability:**
- Single-instance application (no load balancing)
- File uploads won't sync across multiple instances
- No distributed session management

### 🔸 API Design

**Pagination:**
- Transaction history pagination exists but optional
- No pagination on services/banners endpoints
- Default limits may return large datasets

**Error Messages:**
- Some error messages in Indonesian (not internationalized)
- Error codes not fully standardized across all endpoints
- Stack traces may leak in development mode

**Validation:**
- Email format validation is basic
- No phone number validation (not required in spec)
- Date format validation minimal

### 🔸 Testing

**Automated Tests:**
- No unit tests implemented
- No integration tests
- Only Postman collection for manual/automated testing
- No CI/CD pipeline with automated testing

**Test Coverage:**
- Postman tests cover happy path scenarios
- Limited negative test cases
- No load/stress testing implemented
- No security testing (penetration testing)

### 🔸 Deployment

**Environment-Specific Issues:**
- Hardcoded localhost references in some documentation
- Railway environment variables must be manually configured
- No automated deployment script
- No health check endpoint for monitoring

**Database Migration:**
- No migration versioning system
- Schema changes require manual SQL execution
- No rollback mechanism for failed migrations

### 🔸 Monitoring & Logging

**Logging:**
- Basic console.log only
- No structured logging (JSON format)
- No log aggregation service integration
- No log rotation mechanism

**Monitoring:**
- No application performance monitoring (APM)
- No error tracking service (e.g., Sentry)
- No metrics collection (response times, error rates)
- No uptime monitoring

### 🔸 Documentation

**API Documentation:**
- Swagger UI available but may not reflect all edge cases
- Some error responses not fully documented
- No versioning strategy documented
- Example requests may need manual updates

**Code Documentation:**
- Minimal inline comments
- No JSDoc for all functions
- Architecture decisions not documented
- No developer onboarding guide

### 🔸 Feature Gaps

**Missing Features (Out of Spec):**
- No email verification system
- No forgot password functionality
- No two-factor authentication (2FA)
- No user roles/permissions system
- No transaction cancellation/refund
- No notification system (email/SMS)
- No audit log for sensitive operations
- No data export functionality

### 📝 Mitigation Recommendations

For production deployment, consider:
1. ✅ Implement Redis caching layer
2. ✅ Add rate limiting middleware
3. ✅ Use cloud storage (AWS S3, Cloudinary) for images
4. ✅ Implement proper logging (Winston, Pino)
5. ✅ Add health check endpoints
6. ✅ Implement database migration tool (Knex, Sequelize migrations)
7. ✅ Add comprehensive unit and integration tests
8. ✅ Set up error tracking (Sentry, Rollbar)
9. ✅ Implement API versioning
10. ✅ Add request validation middleware enhancements

---

## Contributing

1. Fork repository
2. Create new branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

---

## License

This project is licensed under the ISC License.

---

## Author

**Take Home Test - NUTECH**

---

## Support

If you have any questions or issues, please create an issue in this repository.

---

## Checklist Kriteria Penilaian

- Kesesuaian REST API dengan spesifikasi Kontrak API (Swagger)
- Design database terhadap aplikasi yang dibuat
- Wajib menggunakan raw query dengan implementasi prepared statement
- Kesesuaian Saldo/Balance sesuai perhitungan (topup & transaksi)
- Error handling dengan baik (validasi input)
- Kode yang bersih, terstruktur dan mudah dipahami

---

---

*Developed as part of NUTECH take-home test*
