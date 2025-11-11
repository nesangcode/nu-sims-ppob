# API Documentation - SIMS PPOB

Dokumentasi lengkap untuk semua endpoints API SIMS PPOB.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Codes](#error-codes)
5. [Endpoints](#endpoints)
   - [Module Membership](#module-membership)
   - [Module Information](#module-information)
   - [Module Transaction](#module-transaction)

---

## Overview

**Base URL:** `http://localhost:3000` (development)

**Content-Type:** `application/json`

**Authentication:** JWT Bearer Token (untuk protected endpoints)

---

## Authentication

Endpoints yang memerlukan authentication harus menyertakan JWT token di header:

```http
Authorization: Bearer <your_jwt_token>
```

Token didapat dari endpoint `/login` dan berlaku selama 12 jam.

---

## Response Format

Semua response menggunakan format JSON standar:

### Success Response

```json
{
  "status": 0,
  "message": "Sukses",
  "data": {
    // response data
  }
}
```

### Error Response

```json
{
  "status": <error_code>,
  "message": "<error_message>",
  "data": null
}
```

---

## Error Codes

| Status Code | HTTP Status | Description |
|------------|-------------|-------------|
| 0 | 200 | Success |
| 102 | 400 | Bad Request / Validation Error |
| 103 | 401 | Authentication Failed (Login) |
| 108 | 401 | Unauthorized / Token Invalid |
| 404 | 404 | Resource Not Found |
| 500 | 500 | Internal Server Error |

---

## Endpoints

---

## Module Membership

### 1. Registration

Mendaftarkan user baru ke sistem.

**Endpoint:** `POST /registration`

**Authentication:** No

**Request Body:**

```json
{
  "email": "user@nutech-integrasi.com",
  "first_name": "User",
  "last_name": "Nutech",
  "password": "abcdef1234"
}
```

**Field Validations:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| first_name | string | Yes | Not empty |
| last_name | string | Yes | Not empty |
| password | string | Yes | Minimum 8 characters |

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Registrasi berhasil silahkan login",
  "data": null
}
```

**Error Responses:**

**Email sudah terdaftar (400):**
```json
{
  "status": 102,
  "message": "Email sudah terdaftar",
  "data": null
}
```

**Email format invalid (400):**
```json
{
  "status": 102,
  "message": "Parameter email tidak sesuai format",
  "data": null
}
```

**Password terlalu pendek (400):**
```json
{
  "status": 102,
  "message": "Password minimal 8 karakter",
  "data": null
}
```

---

### 2. Login

Login user dan mendapatkan JWT token.

**Endpoint:** `POST /login`

**Authentication:** No

**Request Body:**

```json
{
  "email": "user@nutech-integrasi.com",
  "password": "abcdef1234"
}
```

**Field Validations:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Not empty |

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Login Sukses",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQG51dGVjaC1pbnRlZ3Jhc2kuY29tIiwiaWF0IjoxNjkyMjY0MDAwLCJleHAiOjE2OTIzMDcyMDB9.xxxx"
  }
}
```

**Error Response:**

**Username atau password salah (401):**
```json
{
  "status": 103,
  "message": "Username atau password salah",
  "data": null
}
```

---

### 3. Get Profile

Mendapatkan informasi profile user yang sedang login.

**Endpoint:** `GET /profile`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
```

**Success Response (200):**

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

**Notes:**
- `profile_image` bisa `null` jika user belum upload foto

**Error Response:**

**Token invalid/expired (401):**
```json
{
  "status": 108,
  "message": "Token tidak valid atau kadaluwarsa",
  "data": null
}
```

---

### 4. Update Profile

Update informasi profile user (first_name dan last_name).

**Endpoint:** `PUT /profile/update`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "first_name": "User Updated",
  "last_name": "Nutech Updated"
}
```

**Field Validations:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| first_name | string | Yes | Not empty |
| last_name | string | Yes | Not empty |

**Success Response (200):**

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

**Error Response:**

**Validation error (400):**
```json
{
  "status": 102,
  "message": "First name harus diisi",
  "data": null
}
```

---

### 5. Update Profile Image

Upload dan update foto profile user.

**Endpoint:** `PUT /profile/image`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | file | Yes | Image file (jpeg, jpg, png) |

**File Constraints:**
- Format: jpeg, jpg, png only
- Max size: 5MB

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Update Profile Image berhasil",
  "data": {
    "email": "user@nutech-integrasi.com",
    "first_name": "User",
    "last_name": "Nutech",
    "profile_image": "http://localhost:3000/uploads/profile-1692264000000-123456789.jpg"
  }
}
```

**Error Responses:**

**Format tidak sesuai (400):**
```json
{
  "status": 102,
  "message": "Format Image tidak sesuai",
  "data": null
}
```

**No file uploaded (400):**
```json
{
  "status": 102,
  "message": "Format Image tidak sesuai",
  "data": null
}
```

---

## Module Information

### 1. Get Banners

Mendapatkan list banner yang tersedia.

**Endpoint:** `GET /banner`

**Authentication:** No

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Sukses",
  "data": [
    {
      "banner_name": "Banner 1",
      "banner_image": "https://nutech-integrasi.app/dummy.jpg",
      "description": "Lerem Ipsum Dolor sit amet"
    },
    {
      "banner_name": "Banner 2",
      "banner_image": "https://nutech-integrasi.app/dummy.jpg",
      "description": "Lerem Ipsum Dolor sit amet"
    }
  ]
}
```

**Notes:**
- Endpoint ini public, tidak perlu authentication
- Banner diurutkan berdasarkan ID ascending

---

### 2. Get Services

Mendapatkan list layanan/service yang tersedia.

**Endpoint:** `GET /services`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
```

**Success Response (200):**

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
    },
    {
      "service_code": "PLN",
      "service_name": "Listrik",
      "service_icon": "https://nutech-integrasi.app/dummy.jpg",
      "service_tariff": 10000
    },
    {
      "service_code": "PDAM",
      "service_name": "PDAM Berlangganan",
      "service_icon": "https://nutech-integrasi.app/dummy.jpg",
      "service_tariff": 40000
    }
  ]
}
```

**Notes:**
- Service code digunakan untuk melakukan transaksi
- Service tariff dalam satuan Rupiah

---

## Module Transaction

### 1. Get Balance

Mendapatkan balance/saldo user.

**Endpoint:** `GET /balance`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Get Balance Berhasil",
  "data": {
    "balance": 1000000
  }
}
```

**Notes:**
- Balance dalam satuan Rupiah
- Balance tidak bisa negatif

**Error Response:**

**Token invalid (401):**
```json
{
  "status": 108,
  "message": "Token tidak valid atau kadaluwarsa",
  "data": null
}
```

---

### 2. Top Up Balance

Menambah saldo user.

**Endpoint:** `POST /topup`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "top_up_amount": 1000000
}
```

**Field Validations:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| top_up_amount | number | Yes | Must be positive number |

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Top Up Balance berhasil",
  "data": {
    "balance": 2000000
  }
}
```

**Notes:**
- Response mengembalikan balance terbaru setelah topup
- Transaksi topup akan tercatat di transaction history

**Error Responses:**

**Invalid amount (400):**
```json
{
  "status": 102,
  "message": "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
  "data": null
}
```

**Amount not numeric (400):**
```json
{
  "status": 102,
  "message": "Parameter amount hanya boleh angka",
  "data": null
}
```

---

### 3. Transaction (Payment)

Melakukan pembayaran untuk service tertentu.

**Endpoint:** `POST /transaction`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "service_code": "PULSA"
}
```

**Field Validations:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| service_code | string | Yes | Must be valid service code |

**Success Response (200):**

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

**Notes:**
- Service code harus valid (ada di list services)
- Saldo harus mencukupi untuk melakukan transaksi
- Invoice number di-generate otomatis dengan format: `INV{DD}{MM}{YYYY}-{RANDOM}`
- Saldo akan berkurang otomatis sesuai service tariff

**Error Responses:**

**Service tidak ditemukan (400):**
```json
{
  "status": 102,
  "message": "Service atau Layanan tidak ditemukan",
  "data": null
}
```

**Saldo tidak cukup (400):**
```json
{
  "status": 102,
  "message": "Saldo tidak mencukupi",
  "data": null
}
```

---

### 4. Transaction History

Mendapatkan history transaksi user.

**Endpoint:** `GET /transaction/history`

**Authentication:** Yes (Bearer Token)

**Request Headers:**

```http
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| offset | integer | No | 0 | Starting position |
| limit | integer | No | all | Number of records to return |

**Example Requests:**

```http
# Get all history
GET /transaction/history

# Get with pagination
GET /transaction/history?offset=0&limit=3

# Get next page
GET /transaction/history?offset=3&limit=3
```

**Success Response (200):**

```json
{
  "status": 0,
  "message": "Get History Berhasil",
  "data": {
    "offset": 0,
    "limit": 3,
    "records": [
      {
        "invoice_number": "INV17082023-003",
        "transaction_type": "TOPUP",
        "description": "Top Up balance",
        "total_amount": 1000000,
        "created_on": "2023-08-17T12:00:00.000Z"
      },
      {
        "invoice_number": "INV17082023-002",
        "transaction_type": "PAYMENT",
        "description": "Pulsa",
        "total_amount": 40000,
        "created_on": "2023-08-17T11:30:00.000Z"
      },
      {
        "invoice_number": "INV17082023-001",
        "transaction_type": "TOPUP",
        "description": "Top Up balance",
        "total_amount": 500000,
        "created_on": "2023-08-17T10:00:00.000Z"
      }
    ]
  }
}
```

**Notes:**
- History diurutkan dari yang terbaru (DESC by created_on)
- Transaction type: `TOPUP` untuk top up, `PAYMENT` untuk pembayaran
- Description: nama service untuk PAYMENT, "Top Up balance" untuk TOPUP
- Total amount: jumlah transaksi (positif untuk topup, positif untuk payment)

---

## Testing Examples

### Using cURL

**1. Register:**
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

**2. Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Get Profile:**
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**4. Get Services:**
```bash
curl -X GET http://localhost:3000/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**5. Top Up:**
```bash
curl -X POST http://localhost:3000/topup \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "top_up_amount": 100000
  }'
```

**6. Transaction:**
```bash
curl -X POST http://localhost:3000/transaction \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "service_code": "PULSA"
  }'
```

**7. Transaction History:**
```bash
curl -X GET "http://localhost:3000/transaction/history?offset=0&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Untuk production, disarankan implement rate limiting:

- Registration: 5 requests / 15 minutes per IP
- Login: 5 requests / 15 minutes per IP
- Other endpoints: 100 requests / 15 minutes per IP

---

## Best Practices

1. **Selalu validate token** sebelum mengakses protected endpoints
2. **Store token securely** di client (e.g., httpOnly cookie, secure storage)
3. **Refresh token** sebelum expired
4. **Handle errors properly** di client side
5. **Implement retry logic** untuk network errors
6. **Log all transactions** untuk audit trail

---

## Support

Untuk pertanyaan atau issue terkait API, silakan hubungi tim development atau buat issue di repository.

---

**Last Updated:** 2024
**API Version:** 1.0.0
