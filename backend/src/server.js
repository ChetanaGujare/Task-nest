const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const { securityHeaders } = require('./middleware/security');
const { etagMiddleware } = require('./middleware/cache');
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
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match'],
    exposedHeaders: ['ETag', 'Cache-Control'],
}));

// ============================================
// Disable Express default ETag (we use custom)
// ============================================
app.set('etag', false);

// ============================================
// Security Headers (CSP, XSS, etc.)
// ============================================
app.use(securityHeaders);

// ============================================
// Body Parsers (with size limit for DoS protection)
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// ETag + Conditional GET (applies to all GET routes)
// ============================================
app.use(etagMiddleware);

// ============================================
// Routes
// ============================================
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check — short cache
app.get('/api/health', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.json({ success: true, message: 'TaskNest-API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
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
            console.log(`📦 Cache-Control + ETag enabled`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();