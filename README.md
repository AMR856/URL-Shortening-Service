# 🔗 URL Shortener API

A secure URL Shortening service built with **Node.js**, **Express**, and **Prisma ORM**, featuring **JWT authentication**, **refresh tokens**, and **Swagger API documentation**.

---

## 🚀 Features

* ✅ User registration and login with hashed passwords (bcrypt)
* 🔐 JWT-based authentication (access & refresh tokens)
* ✂️ Shorten long URLs into unique short codes
* 🔄 Update or delete existing URLs
* 📊 Track number of clicks per short URL
* 🧾 View detailed statistics for each URL
* 🕒 Automatic timestamps for creation & updates
* 📘 Swagger documentation for all endpoints

---

## 🛠️ Tech Stack

* **Node.js** – JavaScript runtime
* **Express.js** – Web framework
* **Prisma ORM** – Database ORM
* **SQLite / PostgreSQL / MySQL** – Supported databases
* **jsonwebtoken** – For JWT authentication
* **bcryptjs** – Secure password hashing
* **swagger-ui-express** – API documentation
* **Nodemon** – Development auto-reload

---

## 📂 Project Structure

```
project/
├── prisma/
│   └── schema.prisma
├── routes/
│   ├── url.route.js
│   └── users.route.js
├── middlewares/
│   └── auth.js
├── controllers/
│   ├── url.controller.js
│   └── users.controller.js
├── utils/
│   └── utils.js
|── config/
│   └── swagger.js
├── index.js
└── package.json
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up Prisma

Edit your `prisma/schema.prisma` file to use your preferred database, then run:

```bash
npx prisma migrate dev --name init
```

### 4️⃣ Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
ACCESS_TOKEN_SECRET="your_access_secret_here"
REFRESH_TOKEN_SECRET="your_refresh_secret_here"
PORT=5000
```

### 5️⃣ Start the server

```bash
npx nodemon server.js
```

Server will start at:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🔐 Authentication Routes

### **1️⃣ POST /auth/register**

Register a new user.

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
  "id": 1,
  "email": "user@example.com",
  "createdAt": "2025-10-08T12:30:00.000Z"
}
```

**Errors:**

* `400` – Invalid email or password
* `500` – Internal server error

---

### **2️⃣ POST /auth/login**

Login and receive JWT tokens.

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
  "accessToken": "your-access-token",
  "refreshToken": "your-refresh-token"
}
```

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

## 🔗 URL Routes (Protected by Bearer Token)

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

## 🧑‍💻 Development

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
