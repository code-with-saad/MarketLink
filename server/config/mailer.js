const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // If user and pass provided without explicit host (e.g., gmail service)
  if (user && pass && user.includes('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return null;
};

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@marketlink.local';

  // Fallback if SMTP is not configured: log to console for development testing
  if (!transporter) {
    console.log('\n=============================================');
    console.log(`[LOCAL DEV MAIL FALLBACK] OTP for ${toEmail}: ${otp}`);
    console.log('=============================================\n');
    return { success: true, mode: 'console' };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: 'Your MarketLink Password Reset Code',
      text: `Your MarketLink password reset OTP is: ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e3a29;">
          <h2 style="color: #2e7d32;">MarketLink Password Reset</h2>
          <p>You requested a password reset for your MarketLink account.</p>
          <div style="background: #f1f8e9; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1b5e20; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    return { success: true, mode: 'smtp', messageId: info.messageId };
  } catch (error) {
    console.error('SMTP sending error, falling back to console:', error.message);
    console.log('\n=============================================');
    console.log(`[FALLBACK DUE TO SMTP ERROR] OTP for ${toEmail}: ${otp}`);
    console.log('=============================================\n');
    return { success: true, mode: 'console_fallback' };
  }
};

module.exports = { sendOtpEmail };
