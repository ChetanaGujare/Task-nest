const { pool } = require('../config/db');
const { sanitizeInput, validateInput } = require('../middleware/security');

// ============================================
// GET all todos for user
// Caching: private, max-age=60 (short, since user-specific)
// ============================================
async function getTodos(req, res) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC',
            [req.user_id]
        );

        // ✅ Private cache — user-specific data
        res.setHeader('Cache-Control', 'private, max-age=60, must-revalidate');
        // ETag auto-set by middleware

        return res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('getTodos error:', err.message);
        // ❌ Errors should never be cached
        res.setHeader('Cache-Control', 'no-store');
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

// ============================================
// POST create todo — no cache
// ============================================
async function createTodo(req, res) {
    try {
        const titleCheck = validateInput(req.body.title, {
            minLength: 1, maxLength: 200, type: 'string', required: true,
        });
        if (!titleCheck.valid) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(400).json({ success: false, error: titleCheck.error });
        }

        const descCheck = validateInput(req.body.description, {
            minLength: 0, maxLength: 1000, type: 'string', required: false,
        });
        if (!descCheck.valid) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(400).json({ success: false, error: descCheck.error });
        }

        const title = sanitizeInput(titleCheck.value);
        const description = sanitizeInput(descCheck.value || '');

        const [result] = await pool.query(
            'INSERT INTO todos (title, description, completed, user_id) VALUES (?, ?, ?, ?)',
            [title, description, false, req.user_id]
        );

        // ❌ Mutations never cached
        res.setHeader('Cache-Control', 'no-store');
        return res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('createTodo error:', err.message);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

// ============================================
// PUT update todo — no cache
// ============================================
async function updateTodo(req, res) {
    try {
        const todoId = parseInt(req.params.id, 10);
        if (isNaN(todoId) || todoId <= 0) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(400).json({ success: false, error: 'Invalid todo ID' });
        }

        const allowed = ['title', 'description', 'completed'];
        const updates = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined && req.body[key] !== null) {
                if (key === 'title') {
                    const check = validateInput(req.body.title, {
                        minLength: 1, maxLength: 200, type: 'string', required: true,
                    });
                    if (!check.valid) {
                        res.setHeader('Cache-Control', 'no-store');
                        return res.status(400).json({ success: false, error: check.error });
                    }
                    updates[key] = sanitizeInput(check.value);
                } else if (key === 'description') {
                    const check = validateInput(req.body.description, {
                        minLength: 0, maxLength: 1000, type: 'string', required: false,
                    });
                    if (!check.valid) {
                        res.setHeader('Cache-Control', 'no-store');
                        return res.status(400).json({ success: false, error: check.error });
                    }
                    updates[key] = sanitizeInput(check.value);
                } else if (key === 'completed') {
                    const check = validateInput(req.body.completed, { type: 'boolean', required: true });
                    if (!check.valid) {
                        res.setHeader('Cache-Control', 'no-store');
                        return res.status(400).json({ success: false, error: check.error });
                    }
                    updates[key] = check.value;
                }
            }
        }

        if (Object.keys(updates).length === 0) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(400).json({ success: false, error: 'No valid fields to update' });
        }

        const setClause = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), todoId, req.user_id];

        const [result] = await pool.query(
            `UPDATE todos SET ${setClause} WHERE id = ? AND user_id = ?`,
            values
        );
        if (result.affectedRows === 0) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(404).json({ success: false, error: 'Todo not found' });
        }

        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('updateTodo error:', err.message);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

// ============================================
// DELETE todo — no cache
// ============================================
async function deleteTodo(req, res) {
    try {
        const todoId = parseInt(req.params.id, 10);
        if (isNaN(todoId) || todoId <= 0) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(400).json({ success: false, error: 'Invalid todo ID' });
        }

        const [result] = await pool.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [todoId, req.user_id]
        );
        if (result.affectedRows === 0) {
            res.setHeader('Cache-Control', 'no-store');
            return res.status(404).json({ success: false, error: 'Todo not found' });
        }

        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('deleteTodo error:', err.message);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };