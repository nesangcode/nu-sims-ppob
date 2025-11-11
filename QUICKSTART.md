# Quick Start Guide

Panduan cepat untuk menjalankan aplikasi SIMS PPOB API.

## Prerequisites

Pastikan sudah terinstall:
- Node.js (v14+)
- MySQL (v5.7+)
- Git

## Step 1: Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd nu-sims-ppob

# Install dependencies
npm install
```

## Step 2: Setup Database

### Option A: Manual (MySQL Command Line)

```bash
# Login ke MySQL
mysql -u root -p

# Jalankan schema
mysql -u root -p < database/schema.sql
```

### Option B: MySQL Workbench

1. Buka MySQL Workbench
2. Connect ke MySQL server
3. File → Run SQL Script
4. Pilih `database/schema.sql`
5. Execute

### Option C: phpMyAdmin

1. Buka phpMyAdmin
2. Buat database baru: `sims_ppob`
3. Import file `database/schema.sql`

## Step 3: Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env file (gunakan text editor favorit)
notepad .env  # Windows
nano .env     # Linux/Mac
```

Edit sesuai konfigurasi MySQL Anda:

```env
PORT=3000
NODE_ENV=development

# Sesuaikan dengan MySQL Anda
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sims_ppob

JWT_SECRET=rahasia-jwt-key-anda-ganti-ini

APP_URL=http://localhost:3000
```

## Step 4: Run Application

### Development Mode (with auto-reload):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

## Step 5: Test API

### Test dengan Browser

Buka browser dan akses:
```
http://localhost:3000
```

Anda akan melihat:
```json
{
  "status": 0,
  "message": "SIMS PPOB API is running",
  "data": null
}
```

### Test dengan cURL

**1. Register User:**
```bash
curl -X POST http://localhost:3000/registration \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"first_name\":\"Test\",\"last_name\":\"User\",\"password\":\"password123\"}"
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Copy token dari response!

**3. Get Profile:**
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test dengan Postman

**Automated Testing dengan Random Email:**

1. **Import Collection:**
   - Buka Postman
   - Import file `postman_collection.json`

2. **Configure Base URL:**
   - Klik collection "SIMS PPOB API"
   - Tab "Variables"
   - Set `base_url` = `http://localhost:3000`

3. **Run Complete Test Suite:**
   - Collection akan otomatis generate random email setiap kali dijalankan
   - Bisa dijalankan berkali-kali tanpa conflict
   - Token otomatis tersimpan dan digunakan untuk request berikutnya

4. **Testing Flow:**
   - Registration → otomatis generate email random (contoh: `user1699123456789@nutech-integrasi.com`)
   - Login → menggunakan email yang sama dari registration
   - Get Profile → verifikasi data user yang baru dibuat
   - Get Balance → cek saldo awal
   - Top Up → tambah saldo
   - Transaction → lakukan transaksi
   - History → cek riwayat transaksi

5. **View Test Results:**
   - Setiap request memiliki automated test
   - Cek tab "Test Results" untuk melihat pass/fail
   - Console akan menampilkan informasi seperti email yang di-generate dan token

**Tips:**
- Jalankan Collection Runner untuk test semua endpoint sekaligus
- Test assertions sudah built-in untuk verifikasi response
- Tidak perlu manual mengubah email, sudah otomatis random

## Quick Test Flow

Berikut flow cepat untuk testing semua fitur:

```bash
# 1. Register
POST /registration
{
  "email": "user@test.com",
  "first_name": "User",
  "last_name": "Test",
  "password": "12345678"
}

# 2. Login (save token)
POST /login
{
  "email": "user@test.com",
  "password": "12345678"
}

# 3. Get Profile
GET /profile
Header: Authorization: Bearer {token}

# 4. Get Services
GET /services
Header: Authorization: Bearer {token}

# 5. Top Up Balance
POST /topup
Header: Authorization: Bearer {token}
{
  "top_up_amount": 1000000
}

# 6. Get Balance
GET /balance
Header: Authorization: Bearer {token}

# 7. Do Transaction
POST /transaction
Header: Authorization: Bearer {token}
{
  "service_code": "PULSA"
}

# 8. Check History
GET /transaction/history?offset=0&limit=5
Header: Authorization: Bearer {token}
```

## Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Fix:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed

**Error:** `Error connecting to database`

**Check:**
1. MySQL server running?
   ```bash
   # Windows
   net start MySQL80
   
   # Linux
   sudo service mysql start
   ```

2. Credentials benar di `.env`?
3. Database `sims_ppob` sudah dibuat?

### Module Not Found

**Error:** `Cannot find module 'express'`

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Token Invalid

**Error:** `Token tidak valid atau kadaluwarsa`

**Fix:**
1. Login lagi untuk dapat token baru
2. Pastikan token di header: `Bearer <token>`
3. Pastikan JWT_SECRET sama dengan saat generate token

## Next Steps

Setelah berhasil running:

1. Baca [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk detail endpoints
2. Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk deploy ke production
3. Explore database schema di `database/schema.sql`
4. Coba semua endpoints dengan Postman collection

## Tips

1. **Development:**
   - Gunakan `npm run dev` untuk auto-reload
   - Check logs di console untuk debugging
   - Gunakan Postman untuk testing

2. **Database:**
   - Backup database sebelum perubahan
   - Check query logs jika ada masalah
   - Gunakan MySQL Workbench untuk monitoring

3. **Security:**
   - Jangan commit file `.env`
   - Ganti JWT_SECRET untuk production
   - Gunakan password kuat untuk MySQL

## Common Commands

```bash
# Install dependencies
npm install

# Run development
npm run dev

# Run production
npm start

# Check Node version
node --version

# Check npm version
npm --version

# Check MySQL
mysql --version

# Show running processes
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

## Need Help?

- Baca README.md untuk informasi lengkap
- Lihat API_DOCUMENTATION.md untuk detail API
- Check DEPLOYMENT.md untuk deployment guide
- Create issue di repository jika ada bug
