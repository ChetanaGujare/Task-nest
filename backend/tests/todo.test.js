const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
    pool: { query: jest.fn() },
}));

const { pool } = require('../src/config/db');
const todoRoutes = require('../src/routes/todoRoutes');

const TEST_SECRET = 'test-secret-key';
process.env.JWT_SECRET = TEST_SECRET;

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

const generateTestToken = (userId = 1) =>
    jwt.sign({ user_id: userId }, TEST_SECRET, { expiresIn: '1h' });

describe('Todo Routes', () => {
    let token;

    beforeEach(() => {
        jest.clearAllMocks();
        token = generateTestToken(1);
    });

    describe('GET /api/todos', () => {
        it('should return 401 without token', async () => {
            const res = await request(app).get('/api/todos');
            expect(res.statusCode).toBe(401);
        });

        it('should return todos for authenticated user', async () => {
            pool.query.mockResolvedValueOnce([[{ id: 1, title: 'Test', completed: 0 }]]);
            const res = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('POST /api/todos', () => {
        it('should return 400 if title missing', async () => {
            const res = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(res.statusCode).toBe(400);
        });

        it('should create todo successfully', async () => {
            pool.query.mockResolvedValueOnce([{ insertId: 5 }]);
            const res = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Learn React' });
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.id).toBe(5);
        });
    });

    describe('PUT /api/todos/:id', () => {
        it('should update todo', async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
            const res = await request(app)
                .put('/api/todos/1')
                .set('Authorization', `Bearer ${token}`)
                .send({ completed: true });
            expect(res.statusCode).toBe(200);
        });
    });

    describe('DELETE /api/todos/:id', () => {
        it('should delete todo successfully', async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
            const res = await request(app)
                .delete('/api/todos/1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if todo not found', async () => {
            pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
            const res = await request(app)
                .delete('/api/todos/999')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        });
    });
});