// services/emailService.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "false",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development",
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

/**
 * Generic email sender function
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 * @param {string} [options.from] - Sender email (defaults to EMAIL_FROM)
 * @returns {Promise<Object>} - Result object
 */
export const sendEmail = async ({ to, subject, html, text, from }) => {
  try {
    const mailOptions = {
      from: from || `"MA Video Hub" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Generate OTP email HTML
 * @param {string} otp - One-time password
 * @param {string} name - User's name
 * @param {number} expiryMinutes - Expiry time in minutes
 * @returns {string} - HTML content
 */
const generateOtpEmailHtml = (otp, name, expiryMinutes = 10) => {
  const year = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code - MA Video Hub</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .logo-icon {
          font-size: 40px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 24px;
          font-weight: bold;
          color: #0A84FF;
          margin-bottom: 15px;
        }
        .message {
          font-size: 16px;
          color: #555;
          margin-bottom: 25px;
        }
        .otp-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #e9edf5 100%);
          border-radius: 12px;
          padding: 30px;
          margin: 25px 0;
          text-align: center;
          border: 2px dashed #0A84FF;
        }
        .otp-code {
          font-size: 48px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #0A84FF;
          font-family: 'Courier New', monospace;
          margin: 20px 0;
        }
        .otp-label {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .expiry-note {
          background-color: #fff8e1;
          border-left: 4px solid #FFD60A;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 8px;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          padding: 25px;
          color: #777;
          font-size: 13px;
          border-top: 1px solid #eee;
          background-color: #fafafa;
        }
        .footer a {
          color: #0A84FF;
          text-decoration: none;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-link {
          display: inline-block;
          margin: 0 10px;
          color: #0A84FF;
        }
        @media only screen and (max-width: 600px) {
          .container { margin: 10px; }
          .content { padding: 20px; }
          .otp-code { font-size: 36px; letter-spacing: 4px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <span class="logo-icon">🎬</span>
            <span>MA Video Hub</span>
          </div>
          <div>Your Premier News & Entertainment Destination</div>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${name}!</div>
          
          <div class="message">
            You requested a One-Time Password (OTP) for secure access to your account.
            Please use the following code:
          </div>
          
          <div class="otp-container">
            <div class="otp-label">Your OTP Code</div>
            <div class="otp-code">${otp}</div>
            <div style="color: #666; font-size: 14px;">Enter this code to proceed</div>
          </div>
          
          <div class="expiry-note">
            <strong>⏰ Time Sensitive:</strong> This OTP will expire in <strong>${expiryMinutes} minutes</strong>. 
            Please use it before it expires.
          </div>
          
          <div class="message" style="margin-top: 30px;">
            <p style="margin-bottom: 10px;"><strong>Didn't request this?</strong></p>
            <p>If you didn't request an OTP, please ignore this email or contact our support team if you have concerns.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>&copy; ${year} MA Video Hub. All rights reserved.</p>
          <p>Made with ❤️ by Maidawa Arewa</p>
          <p style="margin-top: 15px; font-size: 11px;">
            This is an automated email, please do not reply.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @param {string} name - User's name
 * @param {number} expiryMinutes - Expiry time in minutes
 * @returns {Promise<Object>} - Result object
 */
export const sendOtpEmail = async (email, otp, name, expiryMinutes = 10) => {
  const html = generateOtpEmailHtml(otp, name, expiryMinutes);
  const text = `
    MA Video Hub - Your OTP Code
    
    Hello ${name},
    
    Your One-Time Password (OTP) is: ${otp}
    
    This code will expire in ${expiryMinutes} minutes.
    
    If you didn't request this, please ignore this email.
    
    © ${new Date().getFullYear()} MA Video Hub
  `;

  return await sendEmail({
    to: email,
    subject: "🔐 Your OTP Code - MA Video Hub",
    html,
    text,
  });
};

/**
 * Send welcome email after verification
 * @param {string} email - Recipient email
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Result object
 */
export const sendWelcomeEmail = async (email, name) => {
  const year = new Date().getFullYear();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0A84FF, #5E5CE6); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px; }
        .button { background: #0A84FF; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; display: inline-block; }
        .footer { text-align: center; padding: 20px; color: #777; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎬 MA Video Hub</h1>
          <p>Welcome to the Family!</p>
        </div>
        <div class="content">
          <h2>Welcome, ${name}! 🎉</h2>
          <p>Your email has been successfully verified. You now have full access to:</p>
          <ul style="margin: 20px 0;">
            <li>📰 Breaking News Updates</li>
            <li>🎥 HD Video Content</li>
            <li>💬 Community Comments</li>
            <li>🔔 Personalized Notifications</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" class="button">Start Watching</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${year} MA Video Hub</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: "🎉 Welcome to MA Video Hub!",
    html,
  });
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} token - Reset token
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Result object
 */
export const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const year = new Date().getFullYear();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0A84FF, #5E5CE6); color: white; padding: 30px; text-align: center; }
        .content { padding: 40px; }
        .button { background: #0A84FF; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; display: inline-block; }
        .warning { background: #fff8e1; border-left: 4px solid #FFD60A; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #777; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>We received a request to reset your MA Video Hub password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. 
            If you didn't request this, please ignore this email.
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${year} MA Video Hub</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: "🔑 Reset Your MA Video Hub Password",
    html,
  });
};

// Export all functions
export default {
  sendEmail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};