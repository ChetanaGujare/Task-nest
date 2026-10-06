# 🪺 TaskNest

[![TaskNest CI/CD](https://github.com/ChetanaGujare/Task-nest/actions/workflows/ci.yml/badge.svg)](https://github.com/ChetanaGujare/Task-nest/actions/workflows/ci.yml)
[![Backend](https://img.shields.io/badge/backend-tested-green)](https://github.com/ChetanaGujare/Task-nest/actions)
[![Frontend](https://img.shields.io/badge/frontend-tested-green)](https://github.com/ChetanaGujare/Task-nest/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

A full-stack task management application with **JWT authentication**, built with:
- **Backend:** Node.js + Express + MySQL
- **Frontend:** React + Bootstrap 5

## ✨ Features

- User registration and login with JWT
- Create, read, update, delete tasks
- Per-user task isolation
- Progress tracking with visual progress ring
- Dark mode support
- Fully responsive UI
- **CI/CD with GitHub Actions** — automated lint, test, and build

## 🔄 CI/CD Pipeline

Every push and pull request automatically:

- ✅ Runs **ESLint** on frontend and backend
- ✅ Runs **Jest tests** for backend
- ✅ Runs **React tests** for frontend
- ✅ Builds **React production bundle**
- ✅ Uploads **build artifacts**

## 📁 Project Structure
TaskNest/
├── .github/workflows/ci.yml # CI/CD pipeline
├── backend/ # Express + MySQL API
│ ├── src/
│ ├── tests/
│ └── package.json
└── frontend/ # React SPA
├── src/
└── package.json

## 🚀 Installation & Setup

### Backend
```bash
cd backend
npm install
npm start
cd frontend
npm install
npm start

🧪 Testing
Backend
bash
cd backend
npm test              # Jest tests + coverage
npm run lint          # ESLint
Frontend
bash
cd frontend
npm test              # React tests
npm run lint          # ESLint
npm run build         # Production build
📡 API Endpoints
Method	Endpoint	Description
POST	/api/register	Register new user
POST	/api/login	Login and get JWT
GET	/api/me	Get current user
GET	/api/todos	Get all todos
POST	/api/todos	Create todo
PUT	/api/todos/:id	Update todo
DELETE	/api/todos/:id	Delete todo
🔒 Security
Passwords hashed with bcryptjs

JWT-based authentication

Parameterized SQL queries

Environment variables for secrets

📄 License
MIT License

text

---

# 🔟 Remaining Backend Files (Reference — Already Aapke Paas)

Ye files aapke paas already hain, koi change nahi:

- `backend/src/server.js` ✅
- `backend/src/config/db.js` ✅ (SSL support already)
- `backend/src/middleware/auth.js` ✅
- `backend/src/controllers/authController.js` ✅
- `backend/src/controllers/todoController.js` ✅
- `backend/src/routes/authRoutes.js` ✅
- `backend/src/routes/todoRoutes.js` ✅
- `backend/Procfile` ✅
- `backend/.env` ✅
- `backend/.env.example` ✅
- `backend/.gitignore` ✅

---

# 1️⃣1️⃣ Frontend Files (Reference — Already Aapke Paas)

Ye files bhi already hain:

- `frontend/src/api/api.js` ✅
- `frontend/src/components/Navbar.js` ✅
- `frontend/src/components/AuthModal.js` ✅
- `frontend/src/components/TaskForm.js` ✅
- `frontend/src/components/TaskItem.js` ✅
- `frontend/src/components/TaskList.js` ✅
- `frontend/src/components/Stats.js` ✅
- `frontend/src/context/AuthContext.js` ✅
- `frontend/src/pages/Dashboard.js` ✅
- `frontend/src/App.js` ✅
- `frontend/src/App.css` ✅
- `frontend/src/index.js` ✅
- `frontend/src/index.css` ✅

---

# 🚀 Ab Ye Karein — Step by Step

## Step 1: Naye Files Create Karein

| File | Location |
|------|----------|
| `.github/workflows/ci.yml` | Root mein (folders banayein) |
| `backend/jest.config.js` | backend/ |
| `backend/.eslintrc.json` | backend/ |
| `backend/tests/auth.test.js` | backend/tests/ (folder banayein) |
| `backend/tests/todo.test.js` | backend/tests/ |
| `frontend/.eslintrc.json` | frontend/ |

## Step 2: Existing Files Update Karein

- `backend/package.json` → upar wala naya content
- `frontend/src/App.test.js` → naya test
- Root `README.md` → badges ke saath

## Step 3: Dependencies Install Karein

```bash
# Backend
cd C:\Users\Admin\Desktop\TaskNest\backend
npm install

# Frontend
cd C:\Users\Admin\Desktop\TaskNest\frontend
npm install
Step 4: Local Test Karein
bash
# Backend tests
cd backend
npm test
npm run lint

# Frontend tests
cd frontend
npm test -- --watchAll=false
npm run lint
npm run build
Step 5: GitHub Push Karein
bash
cd C:\Users\Admin\Desktop\TaskNest
git add .
git commit -m "Add CI/CD pipeline with GitHub Actions"
git push origin main

Step 6: CI/CD Working Check Karein
GitHub repo → "Actions" tab

Aapko workflow running dikhega:

✅ Backend (Node.js + Jest)

✅ Frontend (React + Jest)

✅ All Checks Passed

Step 7: Branch Protection Rules
Repo → Settings → Branches

"Add branch protection rule"

Pattern: main

✅ Require status checks to pass

Search & select:

Backend (Node.js + Jest)

Frontend (React + Jest)

All Checks Passed

Create