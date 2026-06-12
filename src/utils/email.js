const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationEmail = async (email, name, token) => {
    const verifyUrl = `${process.env.APP_URL}/api/auth/verify?token=${token}`

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Verify your CivicVoice account',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Welcome to CivicVoice, ${name}! 👋</h2>
        <p>Thanks for signing up. Please verify your email to start reporting civic issues.</p>
        <a href="${verifyUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background: #e63946;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 16px 0;
        ">Verify Email</a>
        <p style="color: #666; font-size: 0.9rem;">
          Or copy this link: <br/>
          <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
        <p style="color: #999; font-size: 0.8rem;">
          This link expires in 24 hours. If you didn't sign up, ignore this email.
        </p>
      </div>
    `
    })
}

const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Reset your CivicVoice password',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Password Reset Request 🔐</h2>
        <p>Hi ${name}, we received a request to reset your CivicVoice password.</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background: #e63946;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 16px 0;
        ">Reset Password</a>
        <p style="color: #666; font-size: 0.9rem;">
          Or copy this link: <br/>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
        <p style="color: #999; font-size: 0.8rem;">
          This link expires in 10 minutes. If you didn't request a reset, you can safely ignore this email.
        </p>
      </div>
    `
    })
}

const sendIssueCreatedEmail = async (email, name, issueTitle, category, address) => {
    const appUrl = process.env.APP_URL || 'https://civicvoice.xyz'
    
    // Aesthetic color indicators matching categories
    const categoryColors = {
        road: '#ef4444',
        water: '#3b82f6',
        electricity: '#f97316',
        sanitation: '#22c55e',
        other: '#94a3b8'
    }
    const catColor = categoryColors[category] || '#94a3b8'

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `Issue Registered: ${issueTitle} 🏙️`,
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: bold; color: #0f172a; letter-spacing: -0.025em; display: flex; align-items: center; gap: 8px;">
            CivicVoice <span style="font-size: 16px; font-weight: normal; color: #64748b; background-color: #f1f5f9; padding: 4px 8px; border-radius: 6px;">Report Confirmed</span>
          </span>
        </div>
        
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.3; margin: 0 0 16px 0;">Hello ${name},</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          Thank you for helping clean up our community. We have successfully registered your report on our live civic map. Local administrators and community members can now inspect and upvote your issue.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <h3 style="color: #0f172a; font-size: 16px; font-weight: 700; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Report Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500; width: 80px;">Title</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">${issueTitle}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Category</td>
              <td style="padding: 6px 0;">
                <span style="display: inline-block; background-color: ${catColor}15; color: ${catColor}; font-weight: 700; font-size: 12px; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px;">
                  ${category}
                </span>
              </td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Location</td>
              <td style="color: #334155; padding: 6px 0; font-weight: 500;">${address || 'Coordinates Provided'}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${appUrl}" style="
            display: inline-block;
            padding: 12px 32px;
            background: #0f172a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 24px;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
            transition: all 0.2s ease;
          ">View Live Map</a>
        </div>

        <div style="border-t: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            This email was sent to ${email} automatically by CivicVoice. Thank you for your engagement.
          </p>
        </div>
      </div>
    `
    })
}

const sendIssueStatusUpdateEmail = async (email, name, issueTitle, newStatus, issueId) => {
    const appUrl = process.env.APP_URL || 'https://civicvoice.xyz'

    // Status colors and labels
    const statusMeta = {
        open: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5', label: 'Open' },
        in_progress: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d', label: 'In Progress' },
        resolved: { bg: '#dcfce7', text: '#16a34a', border: '#86efac', label: 'Resolved' }
    }
    const meta = statusMeta[newStatus] || statusMeta['open']

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `[Status Update] ${meta.label}: "${issueTitle}" 🚦`,
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: bold; color: #0f172a; letter-spacing: -0.025em;">
            CivicVoice <span style="font-size: 16px; font-weight: normal; color: #64748b; background-color: #f1f5f9; padding: 4px 8px; border-radius: 6px;">Status Progress</span>
          </span>
        </div>

        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.3; margin: 0 0 16px 0;">Hi ${name},</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          An update has been registered for your reported issue: <strong style="color: #0f172a;">"${issueTitle}"</strong>.
        </p>

        <div style="text-align: center; background-color: #fafafa; border: 1px dashed #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; margin: 0 0 8px 0;">New Status</p>
          <span style="
            display: inline-block;
            background-color: ${meta.bg};
            color: ${meta.text};
            border: 1px solid ${meta.border};
            font-weight: 800;
            font-size: 15px;
            padding: 8px 24px;
            border-radius: 9999px;
            letter-spacing: -0.01em;
          ">
            ${meta.label}
          </span>
          <p style="color: #64748b; font-size: 13px; margin: 12px 0 0 0;">
            ${newStatus === 'resolved' 
                ? 'Great news! Administrators have marked this issue as fully resolved.' 
                : newStatus === 'in_progress' 
                    ? 'Work is currently underway to inspect and address this issue.' 
                    : 'The issue is registered and waiting for review.'}
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${appUrl}" style="
            display: inline-block;
            padding: 12px 32px;
            background: #0f172a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 24px;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
          ">Check Progress on Map</a>
        </div>

        <div style="border-t: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            Report ID: #${issueId} • This email was sent automatically by CivicVoice.
          </p>
        </div>
      </div>
    `
    })
}

const sendAdminEscalationEmail = async (adminEmail, adminName, issueId, issueTitle, upvotes) => {
    const appUrl = process.env.APP_URL || 'https://civicvoice.xyz'

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: adminEmail,
        subject: `⚠️ Escalation Alert: Issue #${issueId} reached ${upvotes} upvotes!`,
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #fca5a5; border-radius: 16px; background-color: #fffaf0; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 20px; font-weight: 900; color: #dc2626; letter-spacing: -0.02em;">
            CivicVoice ADMIN ESCALATION
          </span>
        </div>

        <h2 style="color: #991b1b; font-size: 18px; font-weight: 800; margin: 0 0 12px 0;">Attention ${adminName},</h2>
        <p style="color: #7f1d1d; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
          A community report has gained significant support and has been auto-escalated for immediate administrative review.
        </p>

        <div style="background-color: #ffffff; border: 1px solid #fecaca; border-radius: 12px; padding: 18px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.01);">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #dc2626; padding: 6px 0; font-weight: 700; font-size: 14px; width: 140px;">Community Upvotes</td>
              <td style="color: #991b1b; padding: 6px 0; font-weight: 900; font-size: 16px;">🔥 ${upvotes} Upvotes</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Issue Ref ID</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">#${issueId}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Description</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">${issueTitle}</td>
            </tr>
          </table>
        </div>

        <p style="color: #7f1d1d; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0;">
          Please log in to the CivicVoice Admin Panel to adjust this issue's priority or status (e.g., transition to <strong>In Progress</strong> or <strong>Resolved</strong>).
        </p>

        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${appUrl}/admin" style="
            display: inline-block;
            padding: 12px 28px;
            background: #dc2626;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
            box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
          ">Open Admin Console</a>
        </div>

        <div style="border-t: 1px solid #fee2e2; padding-top: 14px; text-align: center;">
          <p style="color: #f87171; font-size: 10px; margin: 0;">
            This is an automated administrative trigger. Do not reply to this message.
          </p>
        </div>
      </div>
    `
    })
}

const sendAdminNewIssueEmail = async (adminEmail, adminName, issueId, issueTitle, category, address) => {
    const appUrl = process.env.APP_URL || 'https://civicvoice.xyz'

    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: adminEmail,
        subject: `[New Issue Reported] #${issueId}: ${issueTitle} 📥`,
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 20px; font-weight: bold; color: #0f172a; letter-spacing: -0.025em;">
            CivicVoice <span style="font-size: 14px; font-weight: normal; color: #ef4444; background-color: #fee2e2; padding: 4px 8px; border-radius: 6px; font-weight: bold;">New Dispatch</span>
          </span>
        </div>

        <h2 style="color: #0f172a; font-size: 18px; font-weight: 800; margin: 0 0 12px 0;">Hello ${adminName},</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
          A new civic issue has been reported and requires review. Below are the details:
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500; width: 100px;">Issue ID</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">#${issueId}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Title</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">${issueTitle}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Category</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600; text-transform: uppercase;">${category}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 500;">Address</td>
              <td style="color: #0f172a; padding: 6px 0; font-weight: 600;">${address || 'Coordinates Provided'}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${appUrl}/admin" style="
            display: inline-block;
            padding: 10px 24px;
            background: #0f172a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
          ">View Admin Board</a>
        </div>

        <div style="border-t: 1px solid #f1f5f9; padding-top: 14px; text-align: center;">
          <p style="color: #94a3b8; font-size: 10px; margin: 0;">
            This is an automated administrative trigger. Do not reply to this message.
          </p>
        </div>
      </div>
    `
    })
}

module.exports = { 
    sendVerificationEmail, 
    sendPasswordResetEmail,
    sendIssueCreatedEmail,
    sendIssueStatusUpdateEmail,
    sendAdminEscalationEmail,
    sendAdminNewIssueEmail
}