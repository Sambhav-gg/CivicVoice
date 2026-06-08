const { createClient } = require('redis')

let client = null



const getClient = async () => {
    if (client && client.isOpen) return client

    const url = process.env.REDIS_URL || 'redis://localhost:6379'
    console.log("REDIS_URL =", process.env.REDIS_URL)
    console.log(`[Redis] connecting to ${url}`)

    client = createClient({ url })
    client.on('error', (err) => console.error('Redis client error:', err.message))
    client.on('connect', () => console.log('[Redis] connected'))

    await client.connect()
    return client
}

const get = async (key) => {
    try {
        const c = await getClient()
        const val = await c.get(key)
        return val ? JSON.parse(val) : null
    } catch (err) {
        console.error('[Redis] get failed, skipping cache:', err.message)
        return null
    }
}

const set = async (key, value, ttlSeconds = 30) => {
    try {
        const c = await getClient()
        await c.setEx(key, ttlSeconds, JSON.stringify(value))
    } catch (err) {
        console.error('[Redis] set failed:', err.message)
    }
}

const del = async (pattern) => {
    try {
        const c = await getClient()
        const keys = await c.keys(pattern)
        if (keys.length) await c.del(keys)
    } catch (err) {
        console.error('[Redis] del failed:', err.message)
    }
}

// const connect = async () => { }  // no-op, lazy connection
const connect = async () => {
    await getClient()
}
module.exports = { get, set, del, connect }