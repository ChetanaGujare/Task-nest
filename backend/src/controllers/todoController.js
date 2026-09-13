const { pool } = require('../config/db');

async function getTodos(req, res) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC',
            [req.user_id]
        );
        return res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('getTodos error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

async function createTodo(req, res) {
    try {
        const { title, description } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, error: 'Title is required' });
        }

        const [result] = await pool.query(
            'INSERT INTO todos (title, description, completed, user_id) VALUES (?, ?, ?, ?)',
            [title.trim(), description || '', false, req.user_id]
        );
        return res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
        console.error('createTodo error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

async function updateTodo(req, res) {
    try {
        const { id } = req.params;
        const allowed = ['title', 'description', 'completed'];
        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined && req.body[key] !== null) {
                updates[key] = req.body[key];
            }
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, error: 'No valid fields to update' });
        }

        const setClause = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), id, req.user_id];

        const [result] = await pool.query(
            `UPDATE todos SET ${setClause} WHERE id = ? AND user_id = ?`,
            values
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Todo not found or not yours' });
        }
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('updateTodo error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

async function deleteTodo(req, res) {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [id, req.user_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Todo not found or not yours' });
        }
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('deleteTodo error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };