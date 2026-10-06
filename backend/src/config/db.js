const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool
 * Works for local MySQL, PlanetScale, and TiDB Cloud.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todo_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    // SSL required for cloud MySQL (PlanetScale, TiDB Cloud, Aiven, etc.)
    ssl: process.env.DB_HOST && (
        process.env.DB_HOST.includes('psdb.cloud') ||
        process.env.DB_HOST.includes('tidbcloud.com') ||
        process.env.DB_HOST.includes('aivencloud.com')
    )
        ? { rejectUnauthorized: false }
        : undefined,
});

/**
 * Initialize database and tables.
 */
async function initDatabase() {
    try {
        // Auto-create DB only on localhost
        if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost') {
            const tempConn = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
            });
            await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'todo_db'}\``);
            await tempConn.end();
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT FALSE,
                user_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ TaskNest-API: Database and tables ready');
    } catch (err) {
        console.error('❌ Database initialization error:', err.message);
        throw err;
    }
}

module.exports = { pool, initDatabase };