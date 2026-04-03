const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendResetPasswordEmail = async (email, resetLink, name) => {
  const mailOptions = {
    from: `"DivineConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your DivineConnect Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);">
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 48px;">🕉️</div>
          <h1 style="color: #b87333;">DivineConnect</h1>
          <h2 style="color: #4a3728;">Password Reset Request</h2>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>We received a request to reset your password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #b87333; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px;">
              Reset Password
            </a>
          </div>
          
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #7d6b5a; text-align: center;">
            © 2024 DivineConnect. All rights reserved.
          </p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };