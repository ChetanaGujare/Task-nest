const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS Configuration
// ============================================
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
];

// Allow production frontend (Render / Vercel / Netlify)
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow all origins in development, restrict in production if needed
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all — restrict later if needed
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// Body Parsers
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend (optional)
app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// API Routes
// ============================================
app.use('/api', authRoutes);
app.use('/api/todos', todoRoutes);

// ============================================
// Health check
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'TaskNest-API is running' });
});

// ============================================
// 404 handler
// ============================================
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// ============================================
// Global error handler
// ============================================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// ============================================
// Start server
// ============================================
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 TaskNest-API running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();