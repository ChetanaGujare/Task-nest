# 🪺 TaskNest

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

## 📁 Project Structure

```
TaskNest/
├── backend/          # Express + MySQL API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── frontend/         # React SPA
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    └── package.json
```

## 🚀 Installation & Setup

### Backend
```bash
cd backend
npm install
npm start
```
Backend runs at `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

## 🔧 Environment Variables

### Backend `.env`
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login and get JWT |
| GET | `/api/me` | Get current user |
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

## 📄 License

MIT License