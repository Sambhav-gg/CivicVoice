const { Queue, Worker } = require('bullmq')
const db = require('../db')
const { 
    sendVerificationEmail, 
    sendPasswordResetEmail,
    sendIssueCreatedEmail,
    sendIssueStatusUpdateEmail,
    sendAdminEscalationEmail,
    sendAdminNewIssueEmail
} = require('../utils/email')

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

        case 'SEND_PASSWORD_RESET_EMAIL':
            console.log(`[NOTIFY] Sending password reset email to ${data.email}`)
            await sendPasswordResetEmail(data.email, data.name, data.token)
            console.log(`[NOTIFY] Password reset email sent to ${data.email}`)
            break

        case 'NEW_ISSUE': {
            console.log(`[NOTIFY] New issue reported: "${data.title}" in ${data.address}`)
            
            // 1. Notify the reporter if logged in (userId is present)
            if (data.userId) {
                const userRes = await db.query('SELECT name, email FROM users WHERE id = $1', [data.userId])
                if (userRes.rows.length > 0) {
                    const { name, email } = userRes.rows[0]
                    await sendIssueCreatedEmail(email, name, data.title, data.category, data.address)
                    console.log(`[NOTIFY] Receipt email sent to reporter: ${email}`)
                }
            } else {
                console.log('[NOTIFY] No userId provided; issue reported anonymously')
            }

            // 2. Notify all administrators
            const adminRes = await db.query("SELECT name, email FROM users WHERE role = 'admin'")
            for (const admin of adminRes.rows) {
                await sendAdminNewIssueEmail(admin.email, admin.name, data.issueId, data.title, data.category, data.address)
                console.log(`[NOTIFY] New issue alert email sent to admin: ${admin.email}`)
            }
            break
        }

        case 'STATUS_UPDATE': {
            console.log(`[NOTIFY] Issue #${data.issueId} status changed to "${data.status}"`)
            
            // Fetch issue details and reporter info
            const res = await db.query(
                `SELECT i.title, u.email, u.name 
                 FROM issues i 
                 LEFT JOIN users u ON i.user_id = u.id 
                 WHERE i.id = $1`,
                [data.issueId]
            )
            
            if (res.rows.length > 0) {
                const { title, email, name } = res.rows[0]
                if (email) {
                    await sendIssueStatusUpdateEmail(email, name, title, data.status, data.issueId)
                    console.log(`[NOTIFY] Status update email sent to reporter ${email} for Issue #${data.issueId}`)
                } else {
                    console.log(`[NOTIFY] No email to notify for Issue #${data.issueId} (anonymous reporter)`)
                }
            } else {
                console.log(`[NOTIFY] Issue #${data.issueId} not found in database`)
            }
            break
        }

        case 'UPVOTE_MILESTONE': {
            console.log(`[NOTIFY] Issue #${data.issueId} reached ${data.upvotes} upvotes — escalating to admin`)
            
            // Fetch issue title
            const res = await db.query('SELECT title FROM issues WHERE id = $1', [data.issueId])
            if (res.rows.length > 0) {
                const issueTitle = res.rows[0].title
                
                // Fetch all admins
                const adminRes = await db.query("SELECT name, email FROM users WHERE role = 'admin'")
                for (const admin of adminRes.rows) {
                    await sendAdminEscalationEmail(admin.email, admin.name, data.issueId, issueTitle, data.upvotes)
                    console.log(`[NOTIFY] Escalation email sent to admin ${admin.email} for Issue #${data.issueId}`)
                }
            } else {
                console.log(`[NOTIFY] Issue #${data.issueId} not found in database`)
            }
            break
        }

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