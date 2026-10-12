/**
 * Security Middleware
 * Handles: CSP headers, XSS prevention, input validation
 */

// ============================================
// Content Security Policy + Security Headers
// ============================================
function securityHeaders(req, res, next) {
    // Content Security Policy
    res.setHeader(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
            "img-src 'self' data: https:",
            "connect-src 'self' http://localhost:5000 https://*.onrender.com https://*.tidbcloud.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; ')
    );

    // Prevent MIME-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // XSS Protection (legacy browsers)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // HTTPS enforcement (production only)
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
}

// ============================================
// Input Sanitization (Anti-XSS)
// ✅ IMPORTANT: & must be replaced FIRST
// ============================================
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')   // ✅ FIRST — ye zaroori hai
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

// ============================================
// Input Validation Helper
// ============================================
function validateInput(value, { minLength = 0, maxLength = 255, type = 'string', required = true } = {}) {
    if (required && (value === undefined || value === null || value === '')) {
        return { valid: false, error: 'Field is required' };
    }

    if (!required && (value === undefined || value === null || value === '')) {
        return { valid: true, value: '' };
    }

    if (type === 'string') {
        if (typeof value !== 'string') {
            return { valid: false, error: 'Must be a string' };
        }
        const trimmed = value.trim();
        if (trimmed.length < minLength) {
            return { valid: false, error: `Minimum length is ${minLength}` };
        }
        if (trimmed.length > maxLength) {
            return { valid: false, error: `Maximum length is ${maxLength}` };
        }
        return { valid: true, value: trimmed };
    }

    if (type === 'email') {
        if (typeof value !== 'string') {
            return { valid: false, error: 'Invalid email' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) || value.length > 120) {
            return { valid: false, error: 'Invalid email format' };
        }
        return { valid: true, value: value.toLowerCase().trim() };
    }

    if (type === 'boolean') {
        if (typeof value !== 'boolean') {
            return { valid: false, error: 'Must be a boolean' };
        }
        return { valid: true, value };
    }

    return { valid: true, value };
}

module.exports = {
    securityHeaders,
    sanitizeInput,
    validateInput,
};