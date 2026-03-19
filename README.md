# 🔗 URL Shortener API

A secure URL Shortening service built with **NestJS**, **TypeScript**, and **Prisma ORM**, featuring **JWT authentication**, **refresh tokens**, and **Swagger API documentation**. Fully refactored with service layers, DTOs, and enterprise-ready architecture.

---

## Features

* User registration and login with hashed passwords (bcrypt)
* JWT-based authentication (access & refresh tokens)
* Shorten long URLs into unique short codes
* Update or delete existing URLs
* Track number of clicks per short URL
* View detailed statistics for each URL
* Automatic timestamps for creation & updates
* nteractive Swagger documentation for all endpoints
* Enterprise-ready architecture with services, controllers, DTOs, and guards
* Full TypeScript support
* Input validation with class-validator
* Dependency injection pattern

---

## Tech Stack

* **NestJS** – Progressive Node.js framework
* **TypeScript** – Type-safe JavaScript
* **Prisma ORM** – Modern database ORM
* **PostgreSQL / MySQL / SQLite** – Supported databases
* **JWT (jsonwebtoken)** – Secure authentication
* **Passport.js** – Authentication middleware
* **bcrypt** – Secure password hashing
* **Swagger/OpenAPI** – API documentation
* **class-validator** – Data validation
* **class-transformer** – Data transformation

---

## Project Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Root module
├── app.controller.ts                # Health check controller
├── app.service.ts                   # App service
├── auth/                            # Authentication module
│   ├── auth.module.ts              
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│       ├── refresh-token.dto.ts
│       └── auth-response.dto.ts
├── url/                             # URL shortening module
│   ├── url.module.ts
│   ├── controllers/
│   │   └── url.controller.ts
│   ├── services/
│   │   └── url.service.ts
│   ├── entities/
│   │   └── url.entity.ts
│   └── dto/
│       ├── create-url.dto.ts
│       ├── update-url.dto.ts
│       └── url-response.dto.ts
├── prisma/                          # Prisma database integration
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── config/                          # Configuration files
│   └── jwt.config.ts
└── common/                          # Common utilities
    └── utils/
        └── generate-short-code.ts
prisma/
├── schema.prisma                    # Database schema
└── migrations/                      # Migration files
```

---

## Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <repository-url>
cd url-shortener
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener"
ACCESS_TOKEN_SECRET="your_secure_secret_key_here"
REFRESH_TOKEN_SECRET="your_refresh_secret_key_here"
PORT=3000
NODE_ENV=development
```

### 4️⃣ Set up Prisma

Generate Prisma client and run migrations:

```bash
npx prisma migrate dev --name init
```

Or push the schema to database:

```bash
npx prisma db push
```

### 5️⃣ Start the development server

```bash
npm run start:dev
```

Server will start at:
**[http://localhost:3000](http://localhost:3000)**

Swagger docs available at:
**[http://localhost:3000/docs](http://localhost:3000/docs)**

---

## Available Scripts

```bash
npm run build          # Build the application for production
npm run start          # Start the application
npm run start:dev      # Start the application in watch mode
npm run start:prod     # Build and run production build
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests
```

---

## Authentication Routes

### **1️⃣ POST /auth/register**

Register a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Errors:**

* `400` – Validation failed or invalid input
* `409` – Email already registered
* `500` – Internal server error

---

### **2️⃣ POST /auth/login**

Login and receive JWT access and refresh tokens.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Errors:**

* `400` – Validation failed or invalid input
* `401` – Invalid credentials
* `500` – Internal server error

---

### **3️⃣ POST /auth/refresh**

Refresh access token using a valid refresh token.

**Request:**

```json
{
  "token": "your-refresh-token"
}
```

**Response (200):**

```json
{
  "accessToken": "new-access-token"
}
```

**Errors:**

* `400` – Token is required
* `401` – Invalid or expired refresh token
* `500` – Internal server error

---

## URL Shortening Routes

> **Protected Routes:** The following routes require authentication. Include JWT token in the Authorization header:
> ```
> Authorization: Bearer your_access_token
> ```

### **1️⃣ POST /shorten**

Create a new shortened URL.

**Request:**

```json
{
  "url": "https://example.com/very/long/url/that/needs/shortening"
}
```

**Response (201):**

```json
{
  "id": 1,
  "url": "https://example.com/very/long/url/that/needs/shortening",
  "shortCode": "abc123",
  "clicks": 0,
  "createdAt": "2025-03-19T10:30:00Z",
  "updatedAt": "2025-03-19T10:30:00Z"
}
```

**Errors:**

* `400` – Invalid URL format
* `401` – Unauthorized (missing or invalid token)
* `500` – Internal server error

---

### **2️⃣ GET /shorten/:shortCode**

Retrieve original URL and increment click count.

**Response (200):**

```json
{
  "id": 1,
  "url": "https://example.com/very/long/url/that/needs/shortening",
  "shortCode": "abc123",
  "clicks": 5
}
```

**Errors:**

* `400` – Invalid short code
* `404` – Short URL not found
* `500` – Internal server error

---

### **3️⃣ GET /shorten/:shortCode/stats**

Get detailed statistics for a shortened URL.

**Response (200):**

```json
{
  "id": 1,
  "url": "https://example.com/very/long/url/that/needs/shortening",
  "shortCode": "abc123",
  "clicks": 42,
  "createdAt": "2025-03-19T10:30:00Z",
  "updatedAt": "2025-03-19T10:30:00Z",
  "expiresAt": null
}
```

**Errors:**

* `400` – Invalid short code
* `404` – Short URL not found
* `500` – Internal server error

---

### **4️⃣ PUT /shorten/:shortCode**

Update the original URL of a shortened link.

**Request:**

```json
{
  "url": "https://newexample.com/new/long/url"
}
```

**Response (200):**

```json
{
  "id": 1,
  "url": "https://newexample.com/new/long/url",
  "shortCode": "abc123",
  "clicks": 42,
  "updatedAt": "2025-03-19T11:00:00Z"
}
```

**Errors:**

* `400` – Invalid URL format or bad request
* `401` – Unauthorized
* `404` – Short URL not found
* `500` – Internal server error

---

### **5️⃣ DELETE /shorten/:shortCode**

Delete a shortened URL.

**Response (204):**

Successfully deleted (no content)

**Errors:**

* `400` – Invalid short code
* `401` – Unauthorized
* `404` – Short URL not found
* `500` – Internal server error

---

## Architecture Highlights

### **Service Layer**

All business logic is encapsulated in dedicated services:

* **AuthService** - User authentication, token management
* **UrlService** - URL management, validation, and statistics

### **DTOs (Data Transfer Objects)**

Strict input/output contracts with validation:

* **RegisterDto** - User registration validation
* **LoginDto** - User login validation
* **CreateUrlDto** - URL creation validation
* **UpdateUrlDto** - URL update validation
* **UrlResponseDto** - Standardized URL response
* **AuthResponseDto** - Standardized auth response

### **Guards & Strategies**

JWT-based authentication:

* **JwtStrategy** - Validates JWT tokens
* **JwtAuthGuard** - Protects routes requiring authentication

### **Modules**

Organized feature modules:

* **AuthModule** - Authentication feature
* **UrlModule** - URL shortening feature
* **PrismaModule** - Database integration

### **Error Handling**

Consistent error responses with proper HTTP status codes

---

**Errors:**

* `401` – Invalid credentials
* `500` – Internal server error

---

### **3️⃣ POST /auth/refresh**

Generate a new access token using a valid refresh token.

**Request:**

```json
{
  "token": "your-refresh-token"
}
```

**Response (200):**

```json
{
  "accessToken": "new-access-token"
}
```

**Errors:**

* `401` – Missing token
* `403` – Invalid or expired token

---

## URL Routes (Protected by Bearer Token)

All `/shorten/*` routes require an **Authorization header**:

```
Authorization: Bearer <accessToken>
```

---

### **1️⃣ POST /shorten**

Create a new short URL.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response (201):**

```json
{
  "id": 1,
  "url": "https://example.com",
  "shortCode": "abc123",
}
```

---

### **2️⃣ GET /shorten/:shortCode**

Fetch the original URL and increment its click count.

**Response (200):**

```json
{
  "id": 1,
  "url": "https://example.com",
  "shortCode": "abc123",
}
```

---

### **3️⃣ PUT /shorten/:shortCode**

Update an existing short URL.

**Request:**

```json
{
  "url": "https://newsite.com"
}
```

**Response (200):**

```json
{
  "id": 1,
  "url": "https://newsite.com",
  "shortCode": "abc123",
}
```

---

### **4️⃣ DELETE /shorten/:shortCode**

Delete a URL by its short code.

**Response (204)**


### **5️⃣ GET /shorten/:shortCode/stats**

Retrieve analytics (clicks, creation date, etc.) for a URL.

**Response (200):**

```json
{
  "id": 1,
  "url": "https://example.com",
  "shortCode": "abc123",
  "clicks": 10,
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T15:00:00.000Z"
}
```

---

## 📘 API Documentation (Swagger)

After starting the server, access your live Swagger docs at:

👉 **[http://localhost:5000/docs](http://localhost:5000/docs)**

You can:

* Test all endpoints interactively
* Use the **Authorize 🔒** button to add your Bearer Token
* View all request/response schemas

---

## 🧾 Prisma Database Schema

```prisma
model urls {
  id          Int       @id @default(autoincrement()) 
  url         String
  shortCode    String    @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @default(now())
  clicks      Int       @default(0)
  expiresAt   DateTime?
}

model users {
  id            Int             @id @default(autoincrement())
  email         String          @unique
  password      String
  tokens        refresh_tokens[]
}

model refresh_tokens {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  createdAt DateTime  @default(now())
  user      users     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Development

Run the project in development mode:

```bash
npx nodemon server.js
```

Format your code using Prettier:

```bash
npx prettier --write .
```

Run Prisma Studio (GUI for your DB):

```bash
npx prisma studio
```

---

## 🧠 Notes

* Access tokens expire every **5 minutes**.
* Refresh tokens last **1 day** and are stored securely in your database.
* Always send your **Bearer Token** in the `Authorization` header.

Solution for URL Shortening Service Project **https://roadmap.sh/projects/url-shortening-service**
