# 🪺 TaskNest

[![TaskNest CI/CD](https://github.com/ChetanaGujare/Task-nest/actions/workflows/ci.yml/badge.svg)](https://github.com/ChetanaGujare/Task-nest/actions/workflows/ci.yml)
[![Backend Tests](https://img.shields.io/badge/backend-tested-green)](https://github.com/ChetanaGujare/Task-nest/actions)
[![Frontend Tests](https://img.shields.io/badge/frontend-tested-green)](https://github.com/ChetanaGujare/Task-nest/actions)
[![Security](https://img.shields.io/badge/security-XSS%20%7C%20SQLi-blue)](https://github.com/ChetanaGujare/Task-nest)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?logo=swagger)](http://localhost:5000/api-docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **secure, well-documented** full-stack task management application with JWT authentication, HTTP caching, and CI/CD.

## 📚 API Documentation (Swagger UI)

Interactive API documentation is available via **Swagger UI**:

- 🖥️ **Local**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- 📄 **OpenAPI spec**: [http://localhost:5000/api-docs/swagger.yaml](http://localhost:5000/api-docs/swagger.yaml)

**Features:**
- ✅ Try-it-out functionality (execute API calls directly from browser)
- ✅ JWT authorization (click "Authorize" and paste your token)
- ✅ Full schema documentation for all endpoints
- ✅ Request/response examples

### How to Use Swagger UI

1. Start the backend: `cd backend && npm start`
2. Open: http://localhost:5000/api-docs
3. Register or login via `/api/register` or `/api/login` → copy the `token`
4. Click **Authorize** button (top right) → enter: `Bearer YOUR_TOKEN_HERE`
5. Now you can test any authenticated endpoint directly!

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with bcrypt password hashing
- **XSS protection** — Input sanitization + frontend escaping
- **SQL injection prevention** — 100% parameterized queries
- **Content Security Policy** headers
- **Strict CORS whitelist** (rejects unknown origins)
- Server-side validation (types, lengths, formats)

### ⚡ Performance — Caching & ETag
- **Cache-Control headers** — `private, max-age=60` for user data, `public` for static
- **ETag support** — Conditional GET (304 Not Modified)
- **Static asset caching** — 1-year immutable cache for JS/CSS/images
- **MySQL connection pooling**

### 📚 Documentation
- **Swagger UI** at `/api-docs`
- **OpenAPI 3.0 spec** in `backend/src/docs/swagger.yaml`
- Full request/response schemas

### 🔄 CI/CD
- **GitHub Actions** — Runs on every push & PR
- ESLint + Jest on both backend & frontend
- Frontend production build with artifact upload

## 📁 Project Structure
TaskNest/
├── .github/workflows/ci.yml # CI/CD pipeline
├── backend/
│ ├── src/
│ │ ├── config/db.js
│ │ ├── controllers/
│ │ ├── docs/swagger.yaml ← NEW: OpenAPI spec
│ │ ├── middleware/
│ │ │ ├── auth.js
│ │ │ ├── cache.js
│ │ │ └── security.js
│ │ ├── routes/
│ │ └── server.js
│ └── tests/
├── frontend/
└── README.md

text

## 🚀 Setup

### Backend
```bash
cd backend
npm install
npm start
Runs at http://localhost:5000 · Docs at http://localhost:5000/api-docs

Frontend
bash
cd frontend
npm install
npm start
Runs at http://localhost:3000

🧪 Testing
Backend
bash
cd backend
npm test              # Jest (with coverage)
npm run lint          # ESLint
Frontend
bash
cd frontend
npm test -- --watchAll=false
npm run lint
npm run build
📡 API Endpoints
Method	Endpoint	Description	Auth
POST	/api/register	Register new user	No
POST	/api/login	Login and get JWT	No
GET	/api/me	Get current user	Yes
GET	/api/todos	Get all todos	Yes
POST	/api/todos	Create todo	Yes
PUT	/api/todos/:id	Update todo	Yes
DELETE	/api/todos/:id	Delete todo	Yes
🔒 Security
bcryptjs password hashing (10 rounds)

JWT tokens (24-hour expiry)

Parameterized SQL queries

Input sanitization (XSS)

Content Security Policy

CORS whitelist

Body size limits (10kb)

📄 License
MIT License



