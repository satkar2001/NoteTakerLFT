import nodemailer from 'nodemailer';

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail'; 

const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_APP_PASSWORD, 
    },
  });
};

const createResendTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'resend', 
      pass: process.env.RESEND_API_KEY, 
    },
  });
};

const getTransporter = () => {
  if (EMAIL_SERVICE === 'resend' && process.env.RESEND_API_KEY) {
    return createResendTransporter();
  }
  
  if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
    return createGmailTransporter();
  }
  
  console.warn('No email service configured. Please set up Gmail or Resend credentials.');
  return null;
};

export const sendOTPEmail = async (email: string, otp: string, userName?: string) => {
  try {
    const transporter = getTransporter();
    
    if (!transporter) {
      console.error('No email transporter available. Please configure email service.');
      return false;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@yourdomain.com',
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
              <strong>Important:</strong> This OTP will expire in 10 minutes.
            </p>
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



export const testEmailService = async () => {
  const transporter = getTransporter();
  
  if (!transporter) {
    return false;
  }
  
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    return false;
  }
};
