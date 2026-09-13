# 🪺 TaskNest-API

A modern, full‑stack task management application with **JWT authentication**, built with **Node.js + Express** (API), **MySQL** (database), and **Bootstrap 5** (frontend). TaskNest-API provides a clean, responsive UI to organize your daily tasks with complete user isolation and secure authentication.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login with JWT
- Passwords hashed using bcryptjs
- Protected CRUD endpoints — tasks are per‑user
- Tokens expire after 24 hours (configurable)

### ⚙️ Backend (Express API)
- Complete REST API with GET, POST, PUT, DELETE
- MySQL connection pool using `mysql2/promise`
- Auto-creates database & tables on startup
- CORS enabled for cross‑origin requests
- Centralized error handling with JSON responses

### 🎨 Frontend (Bootstrap 5)
- Responsive UI built with Bootstrap 5
- Login / Register using Bootstrap Modal
- Tasks displayed with Bootstrap List Group
- Grid layout with Bootstrap Grid system
- Utility classes for spacing, flex, colors, and typography
- Dark / Light mode toggle (saved in localStorage)
- Real‑time progress ring, progress bar, and stats
- Filter tasks (All / Pending / Done)

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express 4 | Web framework |
| MySQL 8 | Relational database |
| mysql2 | MySQL driver (promise-based) |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variables |
| Bootstrap 5 | Frontend framework |
| Font Awesome | Icons |

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TaskNest-API.git
cd TaskNest-API
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=todo_db
JWT_SECRET=change-this-to-a-random-secret
JWT_EXPIRY=24h
```

### 4. Start the server
```bash
npm start
```

The server will:
- Connect to MySQL
- Auto-create the `todo_db` database and tables
- Serve the frontend at `http://localhost:5000`

### 5. Open in browser
```
http://localhost:5000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register a new user | No |
| POST | `/api/login` | Login and get JWT | No |
| GET | `/api/me` | Get current user info | Yes |
| GET | `/api/todos` | Get all todos for user | Yes |
| POST | `/api/todos` | Create a new todo | Yes |
| PUT | `/api/todos/:id` | Update a todo | Yes |
| DELETE | `/api/todos/:id` | Delete a todo | Yes |

### Example Response

**POST /api/register**
```json
// Request
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 1
}
```

---

## 🧪 Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"secret123"}'

# Login (get token)
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"secret123"}'

# Get all todos (replace <TOKEN>)
curl http://localhost:5000/api/todos \
  -H "Authorization: Bearer <TOKEN>"

# Create a todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Learn Express"}'
```

---

## 📁 Project Structure

```
TaskNest-API/
├── src/
│   ├── server.js              # Express entry point
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── authRoutes.js      # /api/register, /api/login, /api/me
│   │   └── todoRoutes.js      # /api/todos CRUD
│   └── controllers/
│       ├── authController.js  # Auth logic
│       └── todoController.js  # Todo logic
├── public/
│   ├── index.html             # Bootstrap 5 UI
│   └── app.js                 # Frontend logic
├── package.json
├── .env                       # Environment variables (gitignored)
├── .gitignore
└── README.md
```

---

## 🔒 Security Notes

- Passwords hashed using **bcryptjs** (10 rounds)
- JWT tokens expire after 24 hours (configurable via `JWT_EXPIRY`)
- All database queries use **parameterized statements** (SQL injection prevention)
- Sensitive configuration stored in `.env` and gitignored
- CORS restricted to trusted origins (configurable)

---

## 🚀 Future Improvements

- [ ] User profile management
- [ ] Task categories and labels
- [ ] Due dates and reminders
- [ ] Drag and drop reordering
- [ ] Search and filter functionality
- [ ] Email verification on registration
- [ ] Password reset flow
- [ ] Unit tests with Jest
- [ ] Docker containerization
- [ ] Deploy to production (Railway / Render / AWS)

---

