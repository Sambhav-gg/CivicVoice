const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role = 'citizen' } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'name, email, password required' })
        }

        const exists = await db.query('SELECT id FROM users WHERE email = $1', [email])
        if (exists.rows.length) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        const hash = await bcrypt.hash(password, 10)
        const result = await db.query(
            `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
            [name, email, hash, role]
        )

        const user = result.rows[0]
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({ success: true, token, user })
    } catch (err) {
        next(err)
    }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'email and password required' })
        }

        const result = await db.query(
            'SELECT id, name, email, password, role FROM users WHERE email = $1',
            [email]
        )
        const user = result.rows[0]

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
    } catch (err) {
        next(err)
    }
})

// GET /api/auth/me
router.get('/me', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' })
        }
        const token = authHeader.split(' ')[1]
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET)
        const result = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [decoded.id]
        )
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'User not found' })
        res.json({ success: true, user: result.rows[0] })
    } catch (err) {
        next(err)
    }
})

module.exports = router