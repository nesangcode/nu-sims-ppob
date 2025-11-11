# Panduan Deployment

Panduan lengkap untuk deploy aplikasi SIMS PPOB API ke berbagai platform.

---

## Option 1: Railway (Recommended)

Railway adalah platform cloud yang sangat mudah dan cepat untuk deploy aplikasi Node.js.

### Keuntungan Railway:
- Setup cepat dan mudah
- Free tier tersedia (500 jam/bulan, $5 credit)
- Automatic deployments dari GitHub
- Built-in MySQL database
- Custom domain support
- Environment variables management
- Real-time logs

### Langkah-langkah Deploy ke Railway:

#### 1. Persiapan Repository

Pastikan code sudah di-push ke GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### 2. Buat Akun Railway

1. Kunjungi https://railway.app/
2. Klik "Login with GitHub"
3. Authorize Railway untuk akses repository Anda

#### 3. Deploy dari GitHub

1. Di Railway dashboard, klik tombol **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `nu-sims-ppob`
4. Railway akan otomatis detect Node.js dan mulai deploy

#### 4. Setup MySQL Database

1. Di project Railway, klik **"New"** → **"Database"** → **"Add MySQL"**
2. MySQL akan otomatis provisioned
3. Catat kredensial database (atau gunakan environment variables yang sudah disediakan)

#### 5. Import Database Schema

**PENTING:** Railway menggunakan database bernama `railway` by default, gunakan file `schema-railway.sql`

**Cara 1: Menggunakan Railway Plugin (Tercepat!)**

1. Di Railway Dashboard, klik MySQL database service Anda
2. Klik tab **"Data"**
3. Klik **"Query"** tab
4. Copy-paste isi file `database/schema-railway.sql`
5. Klik **"Run Query"**

**Cara 2: Menggunakan Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link ke project (jalankan di root folder project)
railway link

# Connect ke database dan import
railway run mysql -u root -p < database/schema-railway.sql
```

**Cara 3: Menggunakan MySQL Workbench / Client**

1. Dapatkan credentials dari Railway:
   - Host: Lihat di Variables tab (MYSQLHOST)
   - Port: Lihat di Variables tab (MYSQLPORT)
   - User: Lihat di Variables tab (MYSQLUSER)
   - Password: Lihat di Variables tab (MYSQLPASSWORD)
   - Database: `railway`

2. Connect dengan MySQL Workbench
3. File → Run SQL Script
4. Pilih file `database/schema-railway.sql`
5. Execute

**Cara 4: Menggunakan MySQL CLI**

```bash
# Ganti <MYSQLHOST>, <MYSQLPORT>, <MYSQLUSER>, <MYSQLPASSWORD> dengan values dari Railway
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> railway < database/schema-railway.sql
```

**Verifikasi Schema:**

Connect ke database dan check tables:
```sql
SHOW TABLES;
-- Harus menampilkan: users, balances, services, banners, transactions

SELECT COUNT(*) FROM services;
-- Harus menampilkan: 12 (jumlah services)

SELECT COUNT(*) FROM banners;
-- Harus menampilkan: 6 (jumlah banners)
```

#### 6. Setup Environment Variables

Di Railway dashboard:

1. Klik pada service Anda
2. Pilih tab **"Variables"**
3. Tambahkan variables berikut:

```env
NODE_ENV=production
JWT_SECRET=<generate-random-secret-key>
PORT=3000
```

**Note:** Database variables (DB_HOST, DB_USER, dll) sudah otomatis tersedia jika Anda menggunakan Railway MySQL.

Jika menggunakan MySQL dari Railway, variables berikut sudah auto-inject:
- `MYSQLHOST` → Host database
- `MYSQLPORT` → Port database  
- `MYSQLUSER` → Username database
- `MYSQLPASSWORD` → Password database
- `MYSQLDATABASE` → Nama database (default: `railway`)

File `config/database.js` sudah dikonfigurasi untuk menggunakan Railway variables secara otomatis.

#### 7. Deploy Ulang (jika perlu)

Setiap kali Anda push ke GitHub, Railway akan otomatis deploy. 

Untuk manual redeploy:
1. Klik service Anda
2. Klik tab **"Deployments"**
3. Klik **"Redeploy"** pada deployment terbaru

#### 8. Setup Custom Domain (Optional)

1. Di service settings, klik **"Settings"**
2. Scroll ke **"Domains"**
3. Klik **"Generate Domain"** untuk domain Railway gratis
4. Atau tambahkan custom domain Anda

#### 9. Testing

Railway akan memberikan URL seperti:
```
https://nu-sims-ppob-production.up.railway.app
```

Test API Anda:
```bash
curl https://nu-sims-ppob-production.up.railway.app/
```

---

## Option 2: Heroku

### Langkah-langkah Deploy ke Heroku:

#### 1. Install Heroku CLI

**Windows:**
Download dari https://devcenter.heroku.com/articles/heroku-cli

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. Login ke Heroku

```bash
heroku login
```

#### 3. Buat Aplikasi Heroku

```bash
heroku create nu-sims-ppob
```

#### 4. Tambahkan MySQL Add-on

```bash
# JawsDB MySQL (Free tier)
heroku addons:create jawsdb:kitefin

# Atau ClearDB MySQL
heroku addons:create cleardb:ignite
```

#### 5. Get Database Credentials

```bash
heroku config:get JAWSDB_URL
# atau
heroku config:get CLEARDB_DATABASE_URL
```

Parse URL tersebut untuk mendapat credentials.

#### 6. Set Environment Variables

```bash
heroku config:set JWT_SECRET=your-super-secret-key
heroku config:set NODE_ENV=production
```

#### 7. Buat Procfile

Buat file `Procfile` di root project:

```
web: node index.js
```

#### 8. Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

#### 9. Import Database Schema

```bash
# Get database URL
heroku config:get JAWSDB_URL

# Connect and import
mysql -u <user> -p<password> -h <host> <database> < database/schema.sql
```

#### 10. Open App

```bash
heroku open
```

---

## Option 3: DigitalOcean App Platform

### Langkah-langkah:

#### 1. Buat Akun DigitalOcean

Daftar di https://www.digitalocean.com/

#### 2. Buat Database (Optional)

1. Di dashboard, pilih **"Databases"**
2. Buat **"Managed MySQL"** database
3. Catat credentials

#### 3. Deploy App

1. Klik **"Create"** → **"Apps"**
2. Connect ke GitHub repository
3. Pilih repository `nu-sims-ppob`
4. Pilih branch `main`

#### 4. Configure App

1. **Build Command:** (kosongkan, auto-detect)
2. **Run Command:** `node index.js`
3. **Port:** 3000

#### 5. Environment Variables

Tambahkan di App settings:
```
NODE_ENV=production
JWT_SECRET=your-secret-key
DB_HOST=<your-db-host>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=sims_ppob
```

#### 6. Deploy

Klik **"Create Resources"** dan tunggu deployment selesai.

---

## Option 4: Docker & VPS

### Buat Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

### Buat docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=your_password
      - DB_NAME=sims_ppob
      - JWT_SECRET=your_secret_key
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=sims_ppob
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

volumes:
  mysql_data:
```

### Deploy ke VPS

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Install Docker dan Docker Compose
# ...

# Clone repository
git clone <your-repo>
cd nu-sims-ppob

# Build dan run
docker-compose up -d

# Check logs
docker-compose logs -f
```

---

## Monitoring & Maintenance

### Railway Logs

```bash
railway logs
```

### Heroku Logs

```bash
heroku logs --tail
```

### Database Backup

**Railway:**
```bash
railway run mysqldump -u root -p sims_ppob > backup.sql
```

**Heroku:**
```bash
heroku run bash
mysqldump -u <user> -p<password> -h <host> <database> > backup.sql
```

---

## Security Checklist

Sebelum deploy production:

- Ganti JWT_SECRET dengan value yang kuat
- Set NODE_ENV=production
- Enable HTTPS/SSL
- Implement rate limiting
- Setup monitoring (e.g., Sentry)
- Regular database backups
- Review error messages (jangan expose sensitive info)
- Validate all user inputs
- Use environment variables untuk semua secrets
- Enable CORS hanya untuk domain yang diperlukan

---

## Performance Tips

1. Enable Gzip Compression
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. Add Redis Caching (untuk data yang jarang berubah)

3. Database Indexing (sudah ada di schema.sql)

4. Connection Pooling (sudah implemented)

5. Rate Limiting
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use(limiter);
   ```

---

## Troubleshooting

### Database Connection Error

**Problem:** Cannot connect to database

**Solution:**
1. Pastikan database credentials benar
2. Check firewall/network access
3. Verify database service running
4. Check connection string format

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /F /PID <PID>  # Windows
```

### Module Not Found

**Problem:** `Cannot find module 'xxx'`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Upload Not Working

**Problem:** File upload fails

**Solution:**
1. Pastikan folder `uploads/` exists dan writable
2. Check file size limits
3. Verify multer configuration

---

## Support

Jika mengalami masalah deployment:

1. Check logs untuk error messages
2. Verify environment variables
3. Test database connection
4. Review API documentation
5. Create issue di repository

