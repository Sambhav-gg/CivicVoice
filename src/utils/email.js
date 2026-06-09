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

module.exports = { sendVerificationEmail }