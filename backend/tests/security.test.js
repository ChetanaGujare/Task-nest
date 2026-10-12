const request = require('supertest');
const express = require('express');

jest.mock('../src/config/db', () => ({
    pool: { query: jest.fn() },
    initDatabase: jest.fn(),
}));

const { pool } = require('../src/config/db');
const authRoutes = require('../src/routes/authRoutes');
const todoRoutes = require('../src/routes/todoRoutes');
const { sanitizeInput } = require('../src/middleware/security');

const app = express();
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/todos', todoRoutes);

describe('Security Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('XSS Prevention', () => {
        it('should sanitize script tags in username', async () => {
            pool.query.mockResolvedValue([[]]);
            const res = await request(app)
                .post('/api/register')
                .send({
                    username: '<script>alert("xss")</script>',
                    email: 'test@test.com',
                    password: 'secret123',
                });
            expect(res.statusCode).toBe(400);
        });

        it('sanitizeInput should escape HTML entities', () => {
            const result = sanitizeInput('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;');
        });

        it('sanitizeInput should escape quotes', () => {
            const result = sanitizeInput(`"quoted" and 'single'`);
            expect(result).not.toContain('"');
            expect(result).not.toContain("'");
        });
    });

    describe('SQL Injection Prevention', () => {
        it('should reject SQL injection in username during register', async () => {
            pool.query.mockResolvedValue([[]]);
            const res = await request(app)
                .post('/api/register')
                .send({
                    username: "admin'; DROP TABLE users; --",
                    email: 'test@test.com',
                    password: 'secret123',
                });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('Input Validation', () => {
        it('should reject username shorter than 3 chars', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: 'ab', email: 'test@test.com', password: 'secret123' });
            expect(res.statusCode).toBe(400);
        });

        it('should reject invalid email', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: 'testuser', email: 'not-an-email', password: 'secret123' });
            expect(res.statusCode).toBe(400);
        });

        it('should reject password shorter than 6 chars', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: 'testuser', email: 'test@test.com', password: '123' });
            expect(res.statusCode).toBe(400);
        });

        it('should reject long title (> 200 chars)', async () => {
            const jwt = require('jsonwebtoken');
            process.env.JWT_SECRET = 'test-secret-key';
            const token = jwt.sign({ user_id: 1 }, 'test-secret-key', { expiresIn: '1h' });

            const res = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'a'.repeat(201) });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('Security Headers', () => {
        it('should include CSP header in response', async () => {
            const res = await request(app).get('/api/health');
            expect(res.headers['content-security-policy']).toBeDefined();
        });
    });
});