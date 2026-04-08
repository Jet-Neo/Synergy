import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body || req.query);
    next();
});

app.use(
    cors({
    origin: 'http://localhost:5173',  // Vite dev port
    credentials: true
})); // Vite default

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // For AWS RDS
});

pool.connect().then(() => console.log('DB connected')).catch(console.error);

// Signup
app.post('/api/register', async (req, res) => {
    console.log('POST /api/register body:', req.body);
    const { email, password, name } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        console.log('Password hashed');
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hash]
        );
        console.log('User inserted:', result.rows[0]);
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: result.rows[0] });
    } catch (err) {
        console.error('Register error:', err.message, err.code);
        if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));