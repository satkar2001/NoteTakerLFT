import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendOTPEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    console.log('Forgot password request for:', email);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found for forgot password:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('Generated OTP:', { otp, otpExpiry, email });

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: otp,
        resetTokenExpiry: otpExpiry
      }
    });

    console.log('OTP saved to database for:', email);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name || undefined);
    
    if (!emailSent) {
      console.log('Failed to send email for:', email);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    console.log('Reset email sent successfully for:', email);
    res.json({ message: 'Reset email sent successfully' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log('Reset password attempt:', { email, otp: otp ? '***' : 'missing', hasPassword: !!newPassword });

    // Find user first
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found, checking OTP:', {
      hasResetToken: !!user.resetToken,
      resetTokenExpiry: user.resetTokenExpiry,
      currentTime: new Date(),
      isExpired: user.resetTokenExpiry ? new Date() > user.resetTokenExpiry : true
    });

    // Check if OTP matches and is not expired
    if (!user.resetToken || user.resetToken !== otp) {
      console.log('OTP mismatch:', { 
        storedOTP: user.resetToken ? '***' : 'null', 
        providedOTP: otp ? '***' : 'missing' 
      });
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      console.log('OTP expired:', { 
        expiry: user.resetTokenExpiry, 
        currentTime: new Date() 
      });
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    console.log('Password reset successful for:', email);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// Debug endpoint to check OTP status (remove in production)
export const debugOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        resetToken: true,
        resetTokenExpiry: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      email: user.email,
      hasResetToken: !!user.resetToken,
      resetTokenLength: user.resetToken ? user.resetToken.length : 0,
      resetTokenExpiry: user.resetTokenExpiry,
      isExpired: user.resetTokenExpiry ? new Date() > user.resetTokenExpiry : true,
      currentTime: new Date()
    });
  } catch (err) {
    console.error('Debug OTP error:', err);
    res.status(500).json({ error: 'Failed to debug OTP' });
  }
};
