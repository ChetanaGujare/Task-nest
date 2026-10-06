const request = require('supertest');
const express = require('express');

// Mock DB before requiring routes
jest.mock('../src/config/db', () => ({
    pool: { query: jest.fn() },
    initDatabase: jest.fn(),
}));

const { pool } = require('../src/config/db');
const authRoutes = require('../src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api', authRoutes);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/register', () => {
        it('should return 400 if fields missing', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: 'test' });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 if password too short', async () => {
            const res = await request(app)
                .post('/api/register')
                .send({ username: 'test', email: 'test@test.com', password: '123' });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should register user successfully', async () => {
            pool.query
                .mockResolvedValueOnce([[]]) // existing check
                .mockResolvedValueOnce([{ insertId: 1 }]); // insert

            const res = await request(app)
                .post('/api/register')
                .send({ username: 'test', email: 'test@test.com', password: 'secret123' });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        it('should return 400 if username exists', async () => {
            pool.query.mockResolvedValueOnce([[{ id: 1 }]]);
            const res = await request(app)
                .post('/api/register')
                .send({ username: 'test', email: 'test@test.com', password: 'secret123' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/login', () => {
        it('should return 400 if fields missing', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({ username: 'test' });
            expect(res.statusCode).toBe(400);
        });

        it('should return 401 if user not found', async () => {
            pool.query.mockResolvedValueOnce([[]]);
            const res = await request(app)
                .post('/api/login')
                .send({ username: 'nonexistent', password: 'test' });
            expect(res.statusCode).toBe(401);
        });
    });
});