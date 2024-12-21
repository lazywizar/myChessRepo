const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// For development, log emails instead of sending them
const isDevelopment = process.env.NODE_ENV === 'development';

const sendEmail = async (to, subject, html) => {
  if (isDevelopment) {
    console.log('Email would be sent in production:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', html);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <h1>Reset Your Password</h1>
    <p>You requested to reset your password. Click the link below to proceed:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(email, 'Reset Your Password', html);
};

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <h1>Verify Your Email</h1>
    <p>Thank you for registering! Click the link below to verify your email:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

  await sendEmail(email, 'Verify Your Email', html);
};

module.exports = {
  sendResetPasswordEmail,
  sendVerificationEmail
};
