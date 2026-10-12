const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { sanitizeInput, validateInput } = require('../middleware/security');
require('dotenv').config();

function generateToken(userId) {
    return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '24h',
    });
}

async function register(req, res) {
    try {
        // ✅ Server-side validation
        const usernameCheck = validateInput(req.body.username, {
            minLength: 3, maxLength: 30, type: 'string', required: true
        });
        const emailCheck = validateInput(req.body.email, {
            type: 'email', required: true
        });
        const passwordCheck = validateInput(req.body.password, {
            minLength: 6, maxLength: 100, type: 'string', required: true
        });

        if (!usernameCheck.valid) {
            return res.status(400).json({ success: false, error: usernameCheck.error });
        }
        if (!emailCheck.valid) {
            return res.status(400).json({ success: false, error: emailCheck.error });
        }
        if (!passwordCheck.valid) {
            return res.status(400).json({ success: false, error: passwordCheck.error });
        }

        // ✅ Additional username format check
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(usernameCheck.value)) {
            return res.status(400).json({
                success: false,
                error: 'Username can only contain letters, numbers, and underscores',
            });
        }

        // ✅ Sanitize inputs (XSS prevention)
        const username = sanitizeInput(usernameCheck.value);
        const email = sanitizeInput(emailCheck.value);
        const password = passwordCheck.value; // Don't sanitize — hashed anyway

        // ✅ Parameterized query (SQL injection prevention)
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'Username or email already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        // ✅ Parameterized INSERT
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
        const usernameCheck = validateInput(req.body.username, {
            minLength: 3, maxLength: 30, type: 'string', required: true
        });
        const passwordCheck = validateInput(req.body.password, {
            minLength: 1, maxLength: 100, type: 'string', required: true
        });

        if (!usernameCheck.valid || !passwordCheck.valid) {
            return res.status(400).json({ success: false, error: 'Invalid input' });
        }

        const username = sanitizeInput(usernameCheck.value);

        // ✅ Parameterized query
        const [rows] = await pool.query(
            'SELECT id, password_hash FROM users WHERE username = ?',
            [username]
        );
        if (rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const user = rows[0];
        const valid = await bcrypt.compare(passwordCheck.value, user.password_hash);
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
        // ✅ Parameterized query
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