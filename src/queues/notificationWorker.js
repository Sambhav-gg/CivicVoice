const { Queue, Worker } = require('bullmq')
const { sendVerificationEmail } = require('../utils/email')
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
}

// ── Queue ─────────────────────────────────────────────────────────────────────
const notificationQueue = new Queue('notifications', { connection })

// ── Worker ────────────────────────────────────────────────────────────────────
const worker = new Worker('notifications', async (job) => {
    const { type, data } = job.data

    switch (type) {

        case 'SEND_VERIFICATION_EMAIL':
            console.log(`[NOTIFY] Sending verification email to ${data.email}`)
            await sendVerificationEmail(data.email, data.name, data.token)
            console.log(`[NOTIFY] Verification email sent to ${data.email}`)
            break

        case 'NEW_ISSUE':
            console.log(`[NOTIFY] New issue reported in ${data.address}`)
            console.log(`[NOTIFY] Title: "${data.title}" | Category: ${data.category}`)
            // In production: send email/SMS/push notification here
            break

        case 'STATUS_UPDATE':
            console.log(`[NOTIFY] Issue #${data.issueId} status changed to "${data.status}"`)
            console.log(`[NOTIFY] Reporter will be notified at ${data.reporterEmail || 'N/A'}`)
            // In production: notify the citizen who reported it
            break

        case 'UPVOTE_MILESTONE':
            console.log(`[NOTIFY] Issue #${data.issueId} reached ${data.upvotes} upvotes — escalating to admin`)
            // In production: auto-escalate high-upvote issues
            break

        default:
            console.log(`[NOTIFY] Unknown job type: ${type}`)
    }
}, { connection })

worker.on('completed', (job) => {
    console.log(`[QUEUE] Job ${job.id} (${job.data.type}) completed`)
})

worker.on('failed', (job, err) => {
    console.error(`[QUEUE] Job ${job.id} failed:`, err.message)
})

module.exports = { notificationQueue }