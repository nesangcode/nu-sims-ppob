# SIMS PPOB REST API

REST API untuk aplikasi SIMS PPOB (Pulsa, Paket Data, dan Pembayaran Online) menggunakan ExpressJS dengan implementasi raw query dan prepared statements.

## Fitur

- **Module Membership**: Registrasi, Login, Profile Management
- **Module Information**: Banner dan Services
- **Module Transaction**: Balance, Top Up, Payment, Transaction History
- **Security**: JWT Authentication, Password Hashing (bcrypt)
- **Database**: MySQL dengan Raw Query & Prepared Statements
- **Validation**: Input validation menggunakan express-validator
- **Error Handling**: Centralized error handling
- **File Upload**: Profile image upload dengan validasi
- **Swagger UI**: Interactive API documentation

## Prerequisites

- Node.js (v14 atau lebih tinggi)
- MySQL (v5.7 atau lebih tinggi)
- npm atau yarn

## Instalasi

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

Buat database MySQL dan import schema:

```bash
mysql -u root -p < database/schema.sql
```

Atau jalankan query SQL di `database/schema.sql` secara manual.

### 4. Konfigurasi Environment

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi Anda:

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

### 5. Jalankan Aplikasi

**Development Mode (dengan auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### 6. Akses Swagger UI

Setelah server running, buka browser dan akses:

```
http://localhost:3000/api-docs
```

Swagger UI menyediakan:
- Dokumentasi lengkap semua endpoints
- Interface untuk testing API langsung dari browser
- Schema request/response yang jelas
- Fitur authorization untuk protected endpoints

## API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format

Semua response menggunakan format JSON standar:

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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Response Success (200):**
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

**Query Parameters:**
- `offset` (optional): Starting position (default: 0)
- `limit` (optional): Number of records (default: all)

**Example:** `GET /transaction/history?offset=0&limit=3`

**Response Success (200):**
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

Netlify mendukung deployment untuk frontend, namun untuk backend API Node.js, Anda perlu menggunakan **Netlify Functions** (serverless functions). Berikut adalah langkah-langkahnya:

### Persiapan Deploy

**Catatan Penting:** Deployment API Node.js ke Netlify memerlukan penyesuaian karena Netlify lebih cocok untuk static sites dan serverless functions. Untuk production, disarankan menggunakan platform seperti:
- **Railway** (Recommended)
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2/Elastic Beanstalk**
- **Google Cloud Run**

### Alternative 1: Deploy ke Railway (Recommended)

Railway adalah platform yang sangat mudah untuk deploy Node.js API.

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

### Alternative 2: Deploy ke Heroku

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

### Alternative 3: Deploy ke DigitalOcean App Platform

1. **Buat akun di DigitalOcean**
2. **Buat App dari GitHub repository**
3. **Setup database (Managed MySQL)**
4. **Configure environment variables**
5. **Deploy otomatis dari GitHub**

---

## Testing API

Gunakan tools seperti:
- **Postman**: Import collection dari API documentation
- **Thunder Client**: VSCode extension
- **cURL**: Command line

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

**Recommended untuk Production:**
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

API menggunakan centralized error handling dengan response format standar:

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

1. **users**: Menyimpan data user
2. **balances**: Menyimpan saldo user (one-to-one dengan users)
3. **services**: Menyimpan layanan yang tersedia
4. **banners**: Menyimpan banner informasi
5. **transactions**: Menyimpan history transaksi

### Key Features:
- Foreign key constraints
- Indexes pada kolom yang sering di-query
- Prepared statements untuk security
- Transaction dengan FOR UPDATE untuk race condition prevention

---

## Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## License

This project is licensed under the ISC License.

---

## Author

**Take Home Test - NUTECH**

---

## Support

Jika ada pertanyaan atau issue, silakan buat issue di repository ini.

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
