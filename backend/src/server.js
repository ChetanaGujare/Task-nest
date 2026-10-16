const express = require('express');
const cors = require('cors');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const { securityHeaders } = require('./middleware/security');
const { etagMiddleware } = require('./middleware/cache');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Swagger UI Setup
// ============================================
let swaggerDocument;
try {
    const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
    swaggerDocument = YAML.load(swaggerPath);
    console.log('📚 Swagger docs loaded');
} catch (err) {
    console.warn('⚠️  Swagger docs not loaded:', err.message);
}

// ============================================
// CORS Configuration — Strict Whitelist
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
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match'],
    exposedHeaders: ['ETag', 'Cache-Control'],
}));

// Disable Express default ETag (we use custom)
app.set('etag', false);

// ============================================
// Security Headers
// ============================================
app.use(securityHeaders);

// ============================================
// Body Parsers
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// Static Assets Caching
// ============================================
app.use(express.static(path.join(__dirname, '..', 'public'), {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        } else if (
            filePath.endsWith('.js') ||
            filePath.endsWith('.css') ||
            filePath.endsWith('.png') ||
            filePath.endsWith('.jpg') ||
            filePath.endsWith('.svg') ||
            filePath.endsWith('.ico') ||
            filePath.endsWith('.woff') ||
            filePath.endsWith('.woff2')
        ) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=3600');
        }
    },
}));

// ============================================
// ETag + Conditional GET
// ============================================
app.use(etagMiddleware);

// ============================================
// Swagger UI Route
// ============================================
if (swaggerDocument) {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'TaskNest API Docs',
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                filter: true,
                tryItOutEnabled: true,
            },
        })
    );

    // Serve raw swagger.yaml as well (for OpenAPI tooling)
    app.get('/api-docs/swagger.yaml', (req, res) => {
        res.sendFile(path.join(__dirname, 'docs', 'swagger.yaml'));
    });
}

// ============================================
// API Routes
// ============================================
app.use('/api', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.json({ success: true, message: 'TaskNest-API is running' });
});

// Root redirect to docs
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ success: false, error: err.message });
    }
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
            console.log(`🔒 CORS whitelist: ${allowedOrigins.join(', ')}`);
            console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();