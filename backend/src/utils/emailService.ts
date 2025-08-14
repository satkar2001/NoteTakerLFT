import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
    },
  });
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, userName?: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Note Taker LFT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Password Reset</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Note Taker LFT</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello${userName ? ` ${userName}` : ''}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Use the OTP below to complete the process:
            </p>
            
            <div style="background: #fff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>Important:</strong> This OTP will expire in 10 minutes. If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 Note Taker LFT. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Send welcome email (optional)
export const sendWelcomeEmail = async (email: string, userName: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Note Taker LFT! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Welcome to Note Taker LFT!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your note-taking journey begins now</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Note Taker LFT! We're excited to help you organize your thoughts, ideas, and important information in one beautiful, secure place.
            </p>
            
            <div style="background: #fff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🚀 What you can do now:</h3>
              <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                <li>Create your first note</li>
                <li>Organize notes with tags</li>
                <li>Mark important notes as favorites</li>
                <li>Search through your notes</li>
                <li>Switch between grid and list views</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 0;">
              Your account is now active and ready to use. Start creating notes and enjoy the experience!
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>&copy; 2024 Note Taker LFT. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};
