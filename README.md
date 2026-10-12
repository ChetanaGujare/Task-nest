# 🪺 TaskNest

[![TaskNest CI/CD](https://github.com/ChetanaGujare/Task-nest/actions/workflows/ci.yml/badge.svg)](https://github.com/ChetanaGujare/Task-nest/actions/workflows/ci.yml)
[![Backend Tests](https://img.shields.io/badge/backend-tested-green)](https://github.com/ChetanaGujare/Task-nest/actions)
[![Frontend Tests](https://img.shields.io/badge/frontend-tested-green)](https://github.com/ChetanaGujare/Task-nest/actions)
[![Security](https://img.shields.io/badge/security-XSS%20%7C%20SQLi-blue)](https://github.com/ChetanaGujare/Task-nest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **secure** full-stack task management application with JWT authentication, CI/CD, and comprehensive security hardening.

## ✨ Features

- 🔐 JWT authentication with bcrypt password hashing
- 🛡️ **XSS protection** (input sanitization + frontend escaping)
- 🛡️ **SQL injection prevention** (100% parameterized queries)
- 🛡️ **Content Security Policy** headers
- 🛡️ **Server-side validation** (types, lengths, formats)
- 📝 Full CRUD for tasks
- 🎨 Responsive UI (React + Bootstrap 5)
- 🔄 **CI/CD** with GitHub Actions (lint, test, build)

## 🛡️ Security Measures

| # | Protection | Implementation |
|---|-----------|----------------|
| 1 | SQL Injection | Parameterized queries in all controllers |
| 2 | XSS | Input sanitization (backend) + HTML escaping (frontend) |
| 3 | CSP Headers | `middleware/security.js` sets CSP, X-Frame-Options, HSTS |
| 4 | Input Validation | Server-side validation of type, length, format |
| 5 | Rate Limiting | Body size limit (10kb) + test coverage |

## 🔄 CI/CD Pipeline

Every push and PR runs:
- ✅ ESLint on backend + frontend
- ✅ Jest tests for backend (with MySQL service)
- ✅ React tests for frontend
- ✅ Production build of React app
- ✅ Artifact upload

## 📁 Project Structure

```
TaskNest/
├── .github/workflows/ci.yml
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── security.js         ← NEW
│   │   ├── routes/
│   │   └── server.js
│   └── tests/
│       ├── auth.test.js
│       ├── todo.test.js
│       └── security.test.js        ← NEW
└── frontend/
    ├── src/
    │   ├── utils/sanitize.js       ← NEW
    │   ├── components/
    │   └── api/
    └── ...
```

## 🚀 Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🧪 Testing Security

```bash
cd backend
npm test        # Runs all tests including security tests
npm run lint
```

## 📄 License

MIT License