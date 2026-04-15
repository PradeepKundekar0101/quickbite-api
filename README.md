# QuickBite API

A demo food delivery SaaS backend built with Express.js, TypeScript, and MongoDB. Designed as a sample input for **Scalable** — a product that converts SaaS apps into platforms.

This API intentionally includes a mix of safe, cautious, and dangerous routes with sensitive data leakage to demonstrate Scalable's AI-powered route classification.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed the database
npm run seed

# Start development server
npm run dev
```

The server runs on **http://localhost:3001**.

## Demo Credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| User  | rahul@example.com      | password123 |
| Admin | admin@quickbite.com    | admin123    |

## Getting a JWT Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "rahul@example.com", "password": "password123"}'
```

Use the returned token in subsequent requests:

```bash
curl http://localhost:3001/api/orders \
  -H "Authorization: Bearer <token>"
```

## API Endpoints (19 total)

### Safe to Expose (Green)
| Method | Endpoint                    | Auth     | Description                     |
|--------|----------------------------|----------|---------------------------------|
| GET    | `/api/orders`              | Required | List orders for authenticated user |
| GET    | `/api/orders/:id`          | Required | Get single order detail         |
| POST   | `/api/orders`              | Required | Create a new order              |
| GET    | `/api/products`            | None     | List all available products     |
| GET    | `/api/products/:id`        | None     | Get single product              |
| GET    | `/api/products/search?q=`  | None     | Search products by name         |
| GET    | `/api/restaurants`         | None     | List all restaurants            |
| GET    | `/api/restaurants/:id`     | None     | Get restaurant with menu        |
| GET    | `/api/health`              | None     | Health check                    |

### Caution (Yellow) — Leaks sensitive data
| Method | Endpoint                    | Auth     | Description                     |
|--------|----------------------------|----------|---------------------------------|
| GET    | `/api/users/me`            | Required | Profile with passwordHash, internalCreditScore, accountFlags, lastLoginIp |
| PUT    | `/api/users/me`            | Required | Update profile                  |
| PUT    | `/api/orders/:id/cancel`   | Required | Cancel an order                 |

### Dangerous (Red) — Should never be exposed
| Method | Endpoint                         | Auth  | Description                          |
|--------|----------------------------------|-------|--------------------------------------|
| POST   | `/api/auth/login`                | None  | Authentication endpoint              |
| POST   | `/api/auth/register`             | None  | User registration                    |
| GET    | `/api/admin/users`               | Admin | List ALL users with ALL fields       |
| PUT    | `/api/admin/users/:id/ban`       | Admin | Ban a user                           |
| GET    | `/api/admin/config`              | Admin | Internal system configuration        |
| GET    | `/api/analytics/revenue`         | Admin | Revenue analytics with margin data   |
| GET    | `/api/analytics/delivery-partners` | Admin | Delivery partner performance       |

## Sensitive Data Fields

Fields intentionally included in responses for Scalable's AI to detect:

- **User**: `passwordHash`, `internalCreditScore`, `accountFlags`, `lastLoginIp`
- **Order**: `internalMargin`, `supplierCost`, `deliveryPartnerPayout`
- **Product**: `costPrice`, `supplierId`, `internalRating`
- **Restaurant**: `commissionRate`, `internalHealthScore`, `complianceNotes`

## Docker

```bash
docker build -t quickbite-api .
docker run -p 3001:3001 -e MONGODB_URI=<your-uri> -e JWT_SECRET=quickbite-demo-secret-key quickbite-api
```

## Deploy to Railway / Render

1. Push this repo to GitHub
2. Connect to Railway or Render
3. Set environment variables: `MONGODB_URI`, `JWT_SECRET`
4. Deploy — it will auto-detect the Dockerfile

## Tech Stack

- Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
