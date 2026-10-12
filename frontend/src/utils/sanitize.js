/**
 * Frontend sanitization utilities
 * Defense-in-depth: server also sanitizes, but we double-check here.
 */

// ============================================
// Escape HTML entities
// ✅ IMPORTANT: & must be replaced FIRST
// ============================================
export function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')   // ✅ FIRST
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// ============================================
// Strip dangerous patterns (additional layer)
// ============================================
export function stripDangerous(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
}

// ============================================
// Combined sanitize (use before displaying any user content)
// ============================================
export function sanitize(str) {
    return escapeHtml(stripDangerous(str));
}