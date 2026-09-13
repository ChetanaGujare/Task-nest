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
// CORS Configuration — Allow React dev server
// ============================================
app.use(cors({
    origin: [
        'http://localhost:3000',   // React default
        'http://localhost:5173',   // Vite
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// Body Parsers
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Serve static frontend (optional)
// ============================================
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
            console.log(`🚀 TaskNest-API running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();