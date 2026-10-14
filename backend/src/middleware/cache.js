/**
 * Cache Middleware
 * Handles: Cache-Control headers, ETag generation, conditional GET (304)
 */

const crypto = require('crypto');

// ============================================
// Generate ETag from response body
// ============================================
function generateETag(body) {
    const str = typeof body === 'string' ? body : JSON.stringify(body);
    const hash = crypto.createHash('md5').update(str).digest('hex');
    return `"${hash}"`;
}

// ============================================
// Cache-Control middleware for GET endpoints
// Usage: cacheMiddleware({ maxAge: 60, isPublic: true })
// ============================================
function cacheMiddleware(options = {}) {
    const {
        maxAge = 60,           // seconds
        isPublic = false,      // public vs private cache
        staleWhileRevalidate = 30,
        mustRevalidate = true,
    } = options;

    return (req, res, next) => {
        const scope = isPublic ? 'public' : 'private';
        const parts = [
            scope,
            `max-age=${maxAge}`,
            `stale-while-revalidate=${staleWhileRevalidate}`,
        ];
        if (mustRevalidate) parts.push('must-revalidate');

        res.setHeader('Cache-Control', parts.join(', '));
        next();
    };
}

// ============================================
// No-cache middleware for auth/sensitive endpoints
// ============================================
function noCacheMiddleware(req, res, next) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
}

// ============================================
// ETag + Conditional GET middleware
// Automatically generates ETag and handles If-None-Match
// ============================================
function etagMiddleware(req, res, next) {
    // Only apply to GET requests
    if (req.method !== 'GET') {
        return next();
    }

    // Intercept res.json to compute ETag
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        try {
            const etag = generateETag(body);
            res.setHeader('ETag', etag);

            // Check client's If-None-Match header
            const clientETag = req.headers['if-none-match'];
            if (clientETag && clientETag === etag) {
                // Resource unchanged — return 304 Not Modified
                return res.status(304).end();
            }
        } catch (err) {
            console.error('ETag generation error:', err.message);
        }
        return originalJson(body);
    };

    next();
}

module.exports = {
    generateETag,
    cacheMiddleware,
    noCacheMiddleware,
    etagMiddleware,
};