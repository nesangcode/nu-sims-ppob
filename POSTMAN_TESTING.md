# Panduan Testing Postman Collection

Panduan lengkap untuk menggunakan Postman Collection SIMS PPOB API dengan fitur automated testing.

## 📋 Fitur Unggulan

### ✨ Generasi Email Acak
- Setiap test run menggunakan email unique yang di-generate otomatis
- Format: `user{timestamp}{randomNum}@nutech-integrasi.com`
- Tidak perlu manual edit email setiap kali testing
- Bisa run collection berkali-kali tanpa conflict

### 🔄 Manajemen Token Otomatis
- Token dari login otomatis tersimpan sebagai collection variable
- Semua request setelah login otomatis menggunakan token ini
- Tidak perlu copy-paste token manual

### ✅ Test Assertions Bawaan
- Setiap endpoint memiliki test assertions
- Verifikasi status code, response structure, dan data
- Real-time test results di Postman UI

## 🚀 Memulai Cepat

### 1. Import Collection

```bash
# Buka Postman
1. Klik "Import" button
2. Pilih file: postman_collection.json
3. Collection "SIMS PPOB API" akan muncul
```

### 2. Set Base URL

```bash
1. Klik collection "SIMS PPOB API"
2. Tab "Variables"
3. Set base_url value: http://localhost:3000
   (atau ganti dengan URL deployment jika di server)
```

**⚠️ Important:** Untuk testing **Update Profile Image** endpoint, Anda perlu **manually select file** `testphoto.jpg` di Postman (lihat detail di Test Coverage section). File tidak bisa auto-attach karena limitasi Postman.

### 3. Jalankan Request Individual

**Manual Testing:**
```bash
1. Expand "1. Module Membership"
2. Klik "Registration"
3. Klik "Send"
4. Lihat response dan test results
5. Email random akan di-generate otomatis
6. Lanjut ke "Login" - akan menggunakan email yang sama
```

### 4. Jalankan Collection Runner

**Automated Testing Semua Endpoint:**
```bash
1. Klik collection "SIMS PPOB API"
2. Klik "Run" button (atau klik kanan → "Run collection")
3. Pilih requests yang ingin di-test
4. Klik "Run SIMS PPOB API"
5. Lihat hasil test di summary
```

## 📊 Collection Variables

Collection menggunakan variables berikut yang otomatis di-manage:

| Variable | Type | Purpose | Auto-Generated |
|----------|------|---------|----------------|
| `base_url` | string | Base API URL | ❌ Manual |
| `token` | string | JWT authentication token | ✅ Yes (Login) |
| `test_email` | string | Random email for testing | ✅ Yes (Registration) |
| `test_password` | string | Password untuk testing | ❌ Fixed: `abcdef1234` |
| `current_balance` | number | Track balance changes | ✅ Yes (Get Balance) |

## 🧪 Test Coverage

**✅ 100% Coverage - All 12 endpoints have automated tests!**

### Module 1: Membership (5 endpoints)

#### 1. Registration
**Pre-request Script:**
```javascript
// Generate random email
const timestamp = Date.now();
const randomNum = Math.floor(Math.random() * 10000);
const testEmail = `user${timestamp}${randomNum}@nutech-integrasi.com`;
pm.collectionVariables.set("test_email", testEmail);
```

**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure (status, message, data)
- ✅ Registration successful (status === 0)

#### 2. Login
**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Login successful and token received
- ✅ Token is not empty

**Post-response:**
- Token disimpan ke `{{token}}` variable

#### 3. Get Profile
**Tests:**
- ✅ Status code is 200
- ✅ Profile data retrieved successfully
- ✅ Email matches registered email

#### 4. Update Profile
**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Profile updated successfully
- ✅ Updated data matches request (first_name, last_name)

#### 5. Update Profile Image
**⚠️ REQUIRED SETUP - Must Select File Manually:**

Postman requires you to manually select the file before running this request:

1. **Open "Update Profile Image" request in Postman**
2. **Go to "Body" tab → "form-data"**
3. **Click "Select Files" button next to the `file` key**
4. **Navigate to repository root:** `nu-sims-ppob/`
5. **Select `testphoto.jpg`**
6. **Now you can send the request**

**Allowed Formats:**
- JPEG/JPG
- PNG
- Max size: 5MB

**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Profile image updated successfully
- ✅ Profile image URL is not null

**Common Error:** 
If you get `"Format Image tidak sesuai"` error, it means the file wasn't selected properly. Make sure to follow the steps above.

### Module 2: Information (2 endpoints)

#### 6. Get Banners
**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Banners retrieved successfully (array with items)
- ✅ Banner has required fields (banner_name, banner_image, description)

#### 7. Get Services
**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Services retrieved successfully (array with items)
- ✅ Service has required fields (service_code, service_name, service_icon, service_tariff)

### Module 3: Transaction (5 endpoints)

#### 8. Get Balance
**Tests:**
- ✅ Status code is 200
- ✅ Balance retrieved successfully
- ✅ Balance is a number

**Post-response:**
- Balance disimpan ke `{{current_balance}}` variable

#### 9. Top Up
**Tests:**
- ✅ Status code is 200
- ✅ Top up successful
- ✅ Balance increased (compared to previous balance)

#### 10. Transaction
**Tests:**
- ✅ Status code is 200
- ✅ Transaction successful
- ✅ Invoice number generated
- ✅ Has service_code and total_amount

#### 11. Transaction History (with pagination)
**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ Transaction history retrieved successfully
- ✅ Has pagination data (offset, limit, records)
- ✅ Records is an array
- ✅ Transaction record has required fields (invoice_number, transaction_type, total_amount, created_on)
- ✅ Pagination parameters are correct (offset=0, limit=3)

#### 12. Transaction History (All)
**Tests:**
- ✅ Status code is 200
- ✅ Response has correct structure
- ✅ All transaction history retrieved successfully
- ✅ Has pagination data (offset, limit, records)
- ✅ Records is an array
- ✅ Transaction record has required fields (invoice_number, transaction_type, total_amount, created_on)

## 🎯 Best Practices

### Testing Flow

**Recommended Order:**
```
1. Registration (generates random email)
   ↓
2. Login (uses generated email, saves token)
   ↓
3. Get Profile (validates user creation)
   ↓
4. Update Profile (test profile updates)
   ↓
5. Update Profile Image (⚠️ MANUAL: Select testphoto.jpg file first!)
   ↓
6. Get Banners (no auth required - test info module)
   ↓
7. Get Services (test services list)
   ↓
8. Get Balance (saves initial balance - should be 0)
   ↓
9. Top Up (increases balance to 1,000,000)
   ↓
10. Transaction (performs service transaction)
   ↓
11. Transaction History (paginated - validates transaction)
   ↓
12. Transaction History All (get all transactions)
```

### Tips untuk Collection Runner

1. **Select All Requests:**
   - Untuk full integration test
   - Run dalam sequence yang benar

2. **Delay Between Requests:**
   - Set 500ms delay untuk avoid rate limiting
   - Berikan waktu database untuk process

3. **Save Responses:**
   - Enable "Save responses" untuk debugging
   - Review failed requests

4. **Environment Variables:**
   - Untuk multiple environments (dev, staging, prod)
   - Duplicate collection variables ke environment

## 🔧 Customization

### Mengubah Test Password

Edit collection variable:
```javascript
{
  "key": "test_password",
  "value": "password_baru_anda",
  "type": "string"
}
```

### Mengubah Base URL untuk Deployment

**Option 1: Collection Variable**
```
base_url = https://your-app.railway.app
```

**Option 2: Environment**
```
1. Create Environment "Production"
2. Add variable: base_url = https://your-app.railway.app
3. Select environment saat testing
```

### Custom Pre-request Scripts

Tambahkan logic sebelum request:
```javascript
// Contoh: Add timestamp to request
pm.collectionVariables.set("timestamp", Date.now());

// Contoh: Generate random amount
const randomAmount = Math.floor(Math.random() * 1000000) + 10000;
pm.collectionVariables.set("top_up_amount", randomAmount);
```

### Custom Test Scripts

Tambahkan test assertions:
```javascript
// Contoh: Validate email format
pm.test("Email format is valid", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
});

// Contoh: Response time check
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

## 📝 Console Logs

Collection akan menampilkan informasi di Console:

```
Generated test email: user1699123456789@nutech-integrasi.com
Token saved: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Registration completed for: user1699123456789@nutech-integrasi.com
Logged in as: user1699123456789@nutech-integrasi.com
Current balance: 0
New balance: 1000000
Transaction completed: INV20231105-001
```

## 🐛 Troubleshooting

### Email Already Exists Error
**Symptoms:** Registration fails with "Email sudah terdaftar"
**Solution:** 
- Ini seharusnya tidak terjadi karena email di-generate random
- Jika terjadi, kemungkinan race condition
- Run request lagi, akan generate email baru

### Token Invalid
**Symptoms:** Requests after login return 401
**Solution:**
- Check token di collection variables
- Run Login request lagi
- Ensure Bearer prefix di Authorization header

### Base URL Not Set
**Symptoms:** Request fail dengan connection error
**Solution:**
- Set `base_url` di collection variables
- Format: `http://localhost:3000` (tanpa trailing slash)

### Tests Failing
**Symptoms:** Test assertions fail
**Solution:**
- Check response di "Body" tab
- Validate API sudah running
- Ensure database sudah setup
- Check console untuk error messages

### Image Upload Error: "Format Image tidak sesuai" (Status 102)
**Symptoms:** Getting error when uploading profile image
**Causes:**
1. **File not selected** - Most common cause
2. **Wrong file format** - Only JPEG/JPG/PNG allowed
3. **File too large** - Max 5MB

**Solution:**
```bash
1. Open "Update Profile Image" request
2. Go to Body → form-data tab
3. Look for "file" key
4. Click "Select Files" button
5. Navigate to: nu-sims-ppob/testphoto.jpg
6. Select the file
7. Verify file is shown in Postman
8. Send request
```

**Verify File Selected:**
- After selecting, you should see the filename next to the "Select Files" button
- If you see "No file selected", repeat the selection process

## 🚀 Advanced Usage

### Newman CLI

Run collection dari command line:

```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman_collection.json \
  --environment production.json \
  --reporters cli,json \
  --reporter-json-export results.json

# Run with delay
newman run postman_collection.json --delay-request 500
```

### CI/CD Integration

Tambahkan ke pipeline:

```yaml
# GitHub Actions example
- name: Run API Tests
  run: |
    npm install -g newman
    newman run postman_collection.json \
      --env-var "base_url=${{ secrets.API_URL }}" \
      --reporters cli,junit \
      --reporter-junit-export results.xml
```

## 📚 Resources

- [Postman Documentation](https://learning.postman.com/docs)
- [Newman CLI](https://www.npmjs.com/package/newman)
- [API Documentation](./API_DOCUMENTATION.md)
- [Quick Start Guide](./QUICKSTART.md)

## 💡 Next Steps

1. **Customize Tests:** Tambahkan test assertions sesuai kebutuhan
2. **Create Environments:** Setup untuk dev, staging, production
3. **Automate:** Integrate dengan CI/CD pipeline
4. **Monitor:** Setup Postman Monitors untuk automated testing
5. **Share:** Export dan share collection dengan team

---

**Note:** Collection ini di-design untuk testing dan development. Untuk production testing, consider menggunakan dedicated test accounts dan environment.
