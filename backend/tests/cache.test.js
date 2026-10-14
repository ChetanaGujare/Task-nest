const request = require('supertest');
const express = require('express');
const {
    generateETag,
    cacheMiddleware,
    noCacheMiddleware,
    etagMiddleware,
} = require('../src/middleware/cache');

const app = express();
app.set('etag', false);
app.use(etagMiddleware);

// Test routes
app.get('/cached', cacheMiddleware({ maxAge: 60, isPublic: true }), (req, res) => {
    res.json({ message: 'Hello cached world' });
});

app.get('/private', cacheMiddleware({ maxAge: 30, isPublic: false }), (req, res) => {
    res.json({ user: 'test' });
});

app.get('/no-cache', noCacheMiddleware, (req, res) => {
    res.json({ message: 'Sensitive data' });
});

describe('Cache Middleware', () => {
    describe('Cache-Control Headers', () => {
        it('should set public cache header', async () => {
            const res = await request(app).get('/cached');
            expect(res.headers['cache-control']).toContain('public');
            expect(res.headers['cache-control']).toContain('max-age=60');
        });

        it('should set private cache header', async () => {
            const res = await request(app).get('/private');
            expect(res.headers['cache-control']).toContain('private');
            expect(res.headers['cache-control']).toContain('max-age=30');
        });

        it('should set no-store for sensitive endpoints', async () => {
            const res = await request(app).get('/no-cache');
            expect(res.headers['cache-control']).toContain('no-store');
            expect(res.headers['cache-control']).toContain('no-cache');
        });
    });

    describe('ETag Generation', () => {
        it('generateETag should return quoted MD5 hash', () => {
            const etag = generateETag({ test: 'data' });
            expect(etag).toMatch(/^"[a-f0-9]{32}"$/);
        });

        it('generateETag should be deterministic', () => {
            const etag1 = generateETag({ a: 1, b: 2 });
            const etag2 = generateETag({ a: 1, b: 2 });
            expect(etag1).toBe(etag2);
        });

        it('generateETag should differ for different bodies', () => {
            const etag1 = generateETag({ a: 1 });
            const etag2 = generateETag({ a: 2 });
            expect(etag1).not.toBe(etag2);
        });

        it('should include ETag header in response', async () => {
            const res = await request(app).get('/cached');
            expect(res.headers['etag']).toBeDefined();
        });
    });

    describe('Conditional GET (If-None-Match)', () => {
        it('should return 304 when ETag matches', async () => {
            const first = await request(app).get('/cached');
            const etag = first.headers['etag'];
            expect(etag).toBeDefined();

            const second = await request(app)
                .get('/cached')
                .set('If-None-Match', etag);

            expect(second.status).toBe(304);
        });

        it('should return 200 when ETag differs', async () => {
            const res = await request(app)
                .get('/cached')
                .set('If-None-Match', '"different-etag"');

            expect(res.status).toBe(200);
        });

        it('should return 200 when no If-None-Match header', async () => {
            const res = await request(app).get('/cached');
            expect(res.status).toBe(200);
        });
    });
});