# 🔗 URL Shortener API

A simple URL Shortening service built with **Node.js**, **Express**, and **Prisma ORM**.  
It allows users to shorten long URLs, update or delete them, track access statistics, and more.

---

## 🚀 Features

- Shorten long URLs into unique short codes.
- Redirect or fetch original URLs using the short code.
- Update or delete existing URLs.
- Track number of times each short URL is accessed.
- Validate URLs before storing.
- Automatically records creation and update timestamps.

---

## 🛠️ Tech Stack

- **Node.js** – JavaScript runtime  
- **Express.js** – Web framework  
- **Prisma ORM** – Database ORM  
- **SQLite / PostgreSQL / MySQL** – Supported databases  
- **Nodemon** – Auto-reload during development

---

## 📂 Project Structure

```

project/
├── prisma/
│   └── schema.prisma
├── routes/
│   └── url.route.js
├── utils/
│   └── utils.js
├── controllers/
│   └── url.controller.js
├── server.js
└── package.json

````

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Prisma

Edit your `prisma/schema.prisma` file to use your preferred database, then run:

```bash
npx prisma migrate dev --name init
```

### 4. Start the server

```bash
npx nodemon server.js
```

Server will start on:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 📘 API Endpoints

### **1️⃣ POST /shorten**

Create a new short URL.

**Request:**

```json
{
  "url": "https://www.example.com/long/url/path"
}
```

**Response (201):**

```json
{
  "id": 1,
  "originalUrl": "https://www.example.com/long/url/path",
  "shortUrl": "abc123",
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T14:00:00.000Z"
}
```

**Errors:**

* `400` – Invalid or missing URL
* `500` – Internal server error

---

### **2️⃣ GET /shorten/:shortUrl**

Fetch and increment access count for a given short URL.

**Response (200):**

```json
{
  "id": 1,
  "originalUrl": "https://www.example.com/long/url/path",
  "shortUrl": "abc123",
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T14:00:00.000Z"
}
```

**Errors:**

* `400` – Invalid or missing short code
* `404` – URL not found

---

### **3️⃣ PUT /shorten/:shortUrl**

Update the original URL.

**Request:**

```json
{
  "url": "https://www.newsite.com/new/path"
}
```

**Response (200):**

```json
{
  "id": 1,
  "originalUrl": "https://www.newsite.com/new/path",
  "shortUrl": "abc123",
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T16:32:33.048Z"
}
```

---

### **4️⃣ DELETE /shorten/:shortUrl**

Delete a short URL by its short code.

**Response (204):**

```json
{
  "msg": "URL was deleted successfully"
}
```

**Errors:**

* `400` – Invalid or missing short code
* `404` – URL not found

---

### **5️⃣ GET /shorten/:shortUrl/stats**

Retrieve analytics about a specific short URL.

**Response (200):**

```json
{
  "id": 1,
  "originalUrl": "https://www.example.com/long/url/path",
  "shortUrl": "abc123",
  "clicks": 5,
  "createdAt": "2025-10-07T14:00:00.000Z",
  "updatedAt": "2025-10-07T16:32:33.048Z"
}
```

---

## 🧠 Utility Functions

**`generateShortCode()`**
Generates a 6-character alphanumeric string for short URLs.
Example: `"aB12Cd"`

---

## 🧑‍💻 Development

Run in development mode:

```bash
npx nodemon server.js
```

Format your code using Prettier:

```bash
npx prettier --write .
```

---

## 🧾 Example Database Schema (Prisma)

```prisma
model urls {
  id          Int       @id @default(autoincrement())
  originalUrl String
  shortUrl    String    @unique
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  clicks      Int       @default(0)
  expiresAt   DateTime?
}


