const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const db = require('../db')
// const { sendVerificationEmail } = require('../utils/email')
const { notificationQueue } = require('../queues/notificationWorker')
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
        const token = crypto.randomBytes(32).toString('hex')

        const result = await db.query(
            `INSERT INTO users (name, email, password, role, verification_token, is_verified)
       VALUES ($1, $2, $3, $4, $5, FALSE)
       RETURNING id, name, email, role, created_at`,
            [name, email, hash, role, token]
        )

        const user = result.rows[0]

        await notificationQueue.add('notify', {
            type: 'SEND_VERIFICATION_EMAIL',
            data: { email, name, token }
        })

        res.status(201).json({
            success: true,
            message: 'Account created. Please check your email to verify your account.',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        next(err)
    }
})

// GET /api/auth/verify?token=xxx
router.get('/verify', async (req, res, next) => {
    try {
        const { token } = req.query
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token required' })
        }

        const result = await db.query(
            `UPDATE users
       SET is_verified = TRUE, verification_token = NULL
       WHERE verification_token = $1
       RETURNING id, name, email, role`,
            [token]
        )

        if (!result.rows.length) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' })
        }

        const user = result.rows[0]
        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-success?token=${jwtToken}&name=${encodeURIComponent(user.name)}`
        )
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
            'SELECT id, name, email, password, role, is_verified FROM users WHERE email = $1',
            [email]
        )
        const user = result.rows[0]

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in.',
                unverified: true
            })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        next(err)
    }
})

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ success: false, message: 'Email required' })

        const result = await db.query(
            'SELECT id, name, email, is_verified FROM users WHERE email = $1',
            [email]
        )
        const user = result.rows[0]

        if (!user) return res.status(404).json({ success: false, message: 'User not found' })
        if (user.is_verified) return res.status(400).json({ success: false, message: 'Already verified' })

        const token = crypto.randomBytes(32).toString('hex')
        await db.query('UPDATE users SET verification_token = $1 WHERE email = $2', [token, email])

        await notificationQueue.add('notify', {
            type: 'SEND_VERIFICATION_EMAIL',
            data: { email, name: user.name, token }
        })

        res.json({ success: true, message: 'Verification email resent' })
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
            'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = $1',
            [decoded.id]
        )
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'User not found' })
        res.json({ success: true, user: result.rows[0] })
    } catch (err) {
        next(err)
    }
})

module.exports = router