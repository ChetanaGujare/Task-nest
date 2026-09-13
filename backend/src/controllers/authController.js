const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

function generateToken(userId) {
    return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '24h',
    });
}

async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        }

        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'Username or email already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashed]
        );

        const token = generateToken(result.insertId);
        return res.status(201).json({ success: true, token, user_id: result.insertId });
    } catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }

        const [rows] = await pool.query(
            'SELECT id, password_hash FROM users WHERE username = ?',
            [username]
        );
        if (rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        return res.status(200).json({ success: true, token, user_id: user.id });
    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

async function getMe(req, res) {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email FROM users WHERE id = ?',
            [req.user_id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('getMe error:', err.message);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}

module.exports = { register, login, getMe };