const express = require('express')
const router = express.Router()
const db = require('../db')
const { notificationQueue } = require('../queues/notificationWorker')
const redis = require('../db/redis')
const { authenticate, requireAdmin } = require('../middleware/authenticate')

// POST /api/issues — report a new issue
router.post('/', async (req, res, next) => {
    try {
        const { title, description, category, lat, lng, address, image_url, user_id } = req.body

        if (!title || !lat || !lng) {
            return res.status(400).json({ success: false, message: 'title, lat, lng are required' })
        }

        const result = await db.query(
            `INSERT INTO issues (title, description, category, location, address, image_url, user_id)
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326), $6, $7, $8)
       RETURNING id, title, category, status, upvotes, address, created_at`,
            [title, description, category, lat, lng, address, image_url, user_id]
        )

        await redis.del('nearby:*')
        await notificationQueue.add('notify', {
            type: 'NEW_ISSUE',
            data: { title, address, category }
        })

        res.status(201).json({ success: true, issue: result.rows[0] })
    } catch (err) {
        next(err)
    }
})

// GET /api/issues/nearby?lat=28.6&lng=77.2&radius=2000
router.get('/nearby', async (req, res, next) => {
    try {
        const { lat, lng, radius = 2000, category, status } = req.query

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'lat and lng required' })
        }

        const cacheKey = `nearby:${parseFloat(lat).toFixed(3)}:${parseFloat(lng).toFixed(3)}:${radius}:${category || 'all'}:${status || 'all'}`

        const cached = await redis.get(cacheKey)
        if (cached) {
            return res.json({ success: true, count: cached.length, issues: cached, source: 'cache' })
        }

        let query = `
      SELECT
        id, title, description, category, status, upvotes, address, image_url, created_at,
        ST_AsGeoJSON(location)::json AS geojson,
        ROUND(ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography)::numeric, 0) AS distance_metres
      FROM issues
      WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        $3
      )
    `
        const params = [lat, lng, radius]
        let idx = 4

        if (category) { query += ` AND category = $${idx++}`; params.push(category) }
        if (status) { query += ` AND status = $${idx++}`; params.push(status) }

        query += ` ORDER BY distance_metres ASC LIMIT 50`

        const result = await db.query(query, params)
        await redis.set(cacheKey, result.rows, 30)

        res.json({ success: true, count: result.rows.length, issues: result.rows, source: 'db' })
    } catch (err) {
        next(err)
    }
})

// GET /api/issues — paginated list (cursor-based)
router.get('/', async (req, res, next) => {
    try {
        const { cursor, limit = 20, category, status } = req.query
        const take = Math.min(parseInt(limit), 50)

        let query = `SELECT id, title, category, status, upvotes, address, created_at FROM issues WHERE 1=1`
        const params = []
        let idx = 1

        if (cursor) { query += ` AND id < $${idx++}`; params.push(cursor) }
        if (category) { query += ` AND category = $${idx++}`; params.push(category) }
        if (status) { query += ` AND status = $${idx++}`; params.push(status) }

        query += ` ORDER BY id DESC LIMIT $${idx}`
        params.push(take)

        const result = await db.query(query, params)
        const nextCursor = result.rows.length === take
            ? result.rows[result.rows.length - 1].id
            : null

        res.json({ success: true, issues: result.rows, nextCursor })
    } catch (err) {
        next(err)
    }
})

// PATCH /api/issues/:id/upvote
router.patch('/:id/upvote', async (req, res, next) => {
    try {
        const result = await db.query(
            `UPDATE issues SET upvotes = upvotes + 1 WHERE id = $1 RETURNING id, upvotes`,
            [req.params.id]
        )
        if (!result.rows.length) {
            return res.status(404).json({ success: false, message: 'Issue not found' })
        }

        const { id, upvotes } = result.rows[0]

        if (upvotes === 10 || upvotes === 50 || upvotes === 100) {
            await notificationQueue.add('notify', {
                type: 'UPVOTE_MILESTONE',
                data: { issueId: id, upvotes }
            })
        }

        res.json({ success: true, id, upvotes })
    } catch (err) {
        next(err)
    }
})

// PATCH /api/issues/:id/status (admin only)
router.patch('/:id/status', authenticate, requireAdmin, async (req, res, next) => {
    try {
        const { status } = req.body
        const valid = ['open', 'in_progress', 'resolved']
        if (!valid.includes(status)) {
            return res.status(400).json({ success: false, message: `status must be one of ${valid.join(', ')}` })
        }

        const result = await db.query(
            `UPDATE issues SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status, updated_at`,
            [status, req.params.id]
        )
        if (!result.rows.length) {
            return res.status(404).json({ success: false, message: 'Issue not found' })
        }

        await redis.del('nearby:*')
        await notificationQueue.add('notify', {
            type: 'STATUS_UPDATE',
            data: { issueId: req.params.id, status }
        })

        res.json({ success: true, ...result.rows[0] })
    } catch (err) {
        next(err)
    }
})

module.exports = router