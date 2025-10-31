require('dotenv').config()
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_LOGIN,
    pass: process.env.SMTP_KEY,
  },
})

class MailService {
  async sendMail(to, subject, code) {
    try {
      const html = this.generateHTML(code)

      await transporter.sendMail({
        from: `"TaskMaster" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text: `Your verification code: ${code}`,
        html,
      })
    } catch (err) {
      throw err
    }
  }

  generateHTML(code) {
    return `
      <div style="font-family: Arial, sans-serif; background:#f8f9fa; padding:20px;">
        <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:#140e56; color:white; padding:16px 24px; text-align:center;">
            <h2 style="margin:0; font-size:24px;">TaskMaster</h2>
          </div>
          
          <!-- Body -->
          <div style="padding:24px; color:#333;">
            <h3 style="margin-top:0;">Hello!</h3>
            <p>Use the verification code below to confirm your action:</p>
            
            <div style="margin:20px 0; text-align:center;">
              <span style="font-size:28px; font-weight:bold; background:#f1f3f5; padding:12px 24px; border-radius:8px; letter-spacing:4px;">
                ${code}
              </span>
            </div>
            
            <p>If you didn’t request this, please ignore this email.</p>
          </div>
          
          <!-- Footer -->
          <div style="background:#f1f3f5; padding:12px 24px; font-size:12px; color:#666; text-align:center;">
            TaskMaster © ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    `
  }
}

module.exports = new MailService()
