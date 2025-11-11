# Swagger UI Guide

Dokumentasi untuk menggunakan Swagger UI yang sudah terintegrasi dalam aplikasi.

## Mengakses Swagger UI

### 1. Jalankan Server

```bash
npm run dev
```

### 2. Buka Browser

Akses URL berikut:

```
http://localhost:3000/api-docs
```

Swagger UI akan menampilkan dokumentasi lengkap semua endpoints.

---

## Fitur Swagger UI

### View Endpoints

Semua endpoint terorganisir berdasarkan module:
- Module Membership (Registration, Login, Profile)
- Module Information (Banner, Services)
- Module Transaction (Balance, Topup, Transaction)

Setiap endpoint menampilkan:
- Request/response schema
- Contoh data
- Parameter yang diperlukan
- Response codes

### Test API

Untuk testing endpoint:

1. Pilih endpoint yang ingin di-test
2. Klik "Try it out"
3. Isi parameter atau request body
4. Klik "Execute"
5. Response akan ditampilkan di bawah

### Authentication

Untuk endpoint yang memerlukan authentication:

1. Login terlebih dahulu melalui endpoint `POST /login`
2. Copy token JWT dari response
3. Klik tombol "Authorize" di pojok kanan atas
4. Paste token (tanpa kata "Bearer")
5. Klik "Authorize"
6. Klik "Close"

Semua protected endpoint sekarang bisa diakses.

---

## Testing Flow

### Basic Flow

1. **Register**: `POST /registration`
   - Input email, first_name, last_name, password
   
2. **Login**: `POST /login`
   - Input email, password
   - Save token dari response

3. **Authorize**: Klik Authorize, paste token

4. **Test Protected Endpoints**:
   - `GET /profile` - View profile
   - `GET /services` - View available services
   - `GET /balance` - Check balance
   - `POST /topup` - Top up balance
   - `POST /transaction` - Make payment
   - `GET /transaction/history` - View transaction history

---

## Comparison: Swagger vs Postman

| Feature | Swagger UI | Postman |
|---------|-----------|---------|
| Installation | None (built-in) | Required |
| Documentation | Integrated | Separate |
| Quick Testing | Yes | Yes |
| Collections | No | Yes |
| Environments | Limited | Advanced |
| Scripts | No | Yes |

### When to Use

**Swagger UI**:
- Quick API exploration
- Documentation reference
- Simple endpoint testing
- Demo purposes

**Postman**:
- Complex testing scenarios
- Automated testing
- Team collaboration
- Environment management

---

## Configuration

Swagger configuration file: `config/swagger.js`

API documentation (JSDoc): `routes/*.js`

To customize:
1. Edit swagger configuration
2. Update JSDoc comments in routes
3. Restart server

---

## Troubleshooting

### Swagger UI tidak muncul

Check:
- Server running di port 3000
- Akses URL yang benar: `/api-docs`
- Browser console untuk errors

### Token authorization tidak berfungsi

Pastikan:
- Token valid (tidak expired)
- Token di-paste tanpa "Bearer" prefix
- Click "Authorize" setelah paste token

### Endpoint tidak muncul

- Restart server
- Clear browser cache
- Check routes configuration

---

## Reference

- OpenAPI Specification: https://swagger.io/specification/
- Swagger UI Documentation: https://swagger.io/tools/swagger-ui/

---

*Swagger UI provides interactive API documentation for easy testing and exploration.*
