const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const redis = require('./db/redis')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const errorHandler = require('./middleware/error')
const issuesRouter = require('./routes/issues')
const authRouter = require('./routes/auth')

const app = express()
app.set('trust proxy', 1);

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// ── Rate limiting (in-memory store) ──────────────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later' }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many auth attempts, please try again later' }
})

app.use('/api/', limiter)
app.use('/api/auth', authLimiter)

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/issues', issuesRouter)
app.use('/api/auth', authRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    try {
        await redis.connect()
    } catch (err) {
        console.error(err)
    }

})

module.exports = app