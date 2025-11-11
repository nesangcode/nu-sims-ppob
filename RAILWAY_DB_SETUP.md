# 🚨 Quick Fix: Railway Database Setup

## Problem
```
Table 'railway.users' doesn't exist
```

## Solution: Import Database Schema

### ✅ FASTEST METHOD: Railway Dashboard (Recommended!)

**Step-by-step:**

1. **Buka Railway Dashboard**
   - Go to: https://railway.app
   - Login
   - Pilih project Anda

2. **Buka MySQL Database**
   - Klik pada **MySQL service** (bukan Web Service)
   - Akan muncul tabs: Variables, Metrics, Settings, **Data**

3. **Buka Query Tab**
   - Klik tab **"Data"**
   - Klik tab **"Query"**

4. **Copy Schema SQL**
   - Buka file `database/schema-railway.sql` di project Anda
   - Copy SEMUA isi file (Ctrl+A, Ctrl+C)

5. **Paste & Run**
   - Paste ke Query box di Railway
   - Klik **"Run Query"** button
   - Wait for success message

6. **Verify**
   - Run query ini untuk verify:
   ```sql
   SHOW TABLES;
   ```
   - Harus menampilkan: `users`, `balances`, `services`, `banners`, `transactions`

7. **Test API**
   - Kembali ke Postman
   - Run Registration lagi
   - Seharusnya sudah working! ✅

---

### 🔧 Alternative: MySQL Workbench

**If you prefer MySQL Workbench:**

1. **Get Railway Credentials**
   - Di Railway, klik MySQL service
   - Tab **"Variables"**
   - Copy values:
     - `MYSQLHOST` (e.g., `containers-us-west-123.railway.app`)
     - `MYSQLPORT` (e.g., `7777`)
     - `MYSQLUSER` (e.g., `root`)
     - `MYSQLPASSWORD` (click eye icon to reveal)

2. **Connect di MySQL Workbench**
   - Open MySQL Workbench
   - Create New Connection
   - Fill in:
     - Connection Name: `Railway - nu-sims-ppob`
     - Hostname: `<MYSQLHOST value>`
     - Port: `<MYSQLPORT value>`
     - Username: `<MYSQLUSER value>`
     - Password: Click "Store in Keychain" → paste `<MYSQLPASSWORD>`
   - Test Connection
   - Connect

3. **Run Schema**
   - File → Open SQL Script
   - Select: `database/schema-railway.sql`
   - Click Execute (⚡ lightning icon)
   - Wait for "Success" messages

4. **Verify**
   ```sql
   USE railway;
   SHOW TABLES;
   SELECT COUNT(*) FROM services; -- Should return 12
   SELECT COUNT(*) FROM banners; -- Should return 6
   ```

---

### 💻 Alternative: MySQL CLI

**If you have MySQL CLI installed:**

```bash
# Get values from Railway Variables tab first
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> railway < database/schema-railway.sql
```

**Example:**
```bash
mysql -h containers-us-west-123.railway.app -P 7777 -u root -pYourPasswordHere railway < database/schema-railway.sql
```

---

### 🎯 After Schema Import

**Redeploy Your App (Optional but Recommended):**

1. Go to Railway Dashboard
2. Click your **Web Service** (not MySQL)
3. Click **"Deployments"** tab
4. Click **"Redeploy"** on latest deployment

**Or just wait** - Railway will automatically redeploy on next git push.

---

### ✅ Verification Checklist

After importing schema, verify everything:

**1. Check Tables Exist:**
```sql
SHOW TABLES;
```
Expected output:
- balances
- banners
- services
- transactions
- users

**2. Check Services Data:**
```sql
SELECT service_code, service_name FROM services;
```
Should show 12 services (PAJAK, PLN, PDAM, PULSA, etc.)

**3. Check Banners Data:**
```sql
SELECT banner_name FROM banners;
```
Should show 6 banners

**4. Test API:**
```bash
# Test Registration
curl -X POST https://nu-sims-ppob-production.up.railway.app/registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test123@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "abcdef1234"
  }'
```

Should return:
```json
{
  "status": 0,
  "message": "Registrasi berhasil silahkan login",
  "data": null
}
```

---

### 🐛 Troubleshooting

**Error: "Access denied"**
- Check credentials lagi di Railway Variables tab
- Make sure copy password dengan benar (no extra spaces)

**Error: "Can't connect to MySQL server"**
- Check MYSQLHOST dan MYSQLPORT correct
- Railway might be restarting database, wait 1-2 minutes

**Error: "Table already exists"**
- Good! Schema already imported
- Just verify dengan `SHOW TABLES;`

**Still getting "Table doesn't exist"**
1. Make sure you're using `schema-railway.sql` (NOT `schema.sql`)
2. Make sure you're connected to database `railway`
3. Check if tables created: `USE railway; SHOW TABLES;`
4. Redeploy your app di Railway

---

### 📝 Notes

- Railway uses database name **`railway`** by default (NOT `sims_ppob`)
- File `schema.sql` is for local development
- File `schema-railway.sql` is specifically for Railway deployment
- You only need to import schema ONCE per database
- If you reset database, you need to import again

---

**Need Help?**

Check logs:
- Railway → Web Service → Deployments → Click latest → View Logs
- Look for database connection errors

Common issues:
- Wrong database credentials
- Schema not imported
- Database service not running
