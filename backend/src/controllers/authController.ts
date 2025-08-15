import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendOTPEmail } from '../utils/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

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

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

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
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    console.log('Forgot password request for:', email);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry > new Date(Date.now() - 30 * 1000)) {
      console.log('Recent OTP already exists for:', email);
      return res.json({ message: 'Reset email sent successfully' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minute ko expiry 

    console.log('Generated OTP for', email, ':', { otp, expiry: otpExpiry });

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: otp,
        resetTokenExpiry: otpExpiry
      }
    });

    console.log('OTP saved to database for:', email);

    const emailSent = await sendOTPEmail(email, otp, user.name || undefined);
    
    if (!emailSent) {
      console.log('Failed to send email to:', email);
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    console.log('Reset email sent successfully to:', email);
    res.json({ message: 'Reset email sent successfully' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    console.log('Reset password attempt:', { email, otp: otp ? 'PROVIDED' : 'MISSING', newPasswordLength: newPassword?.length });

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found, checking OTP:', {
      storedOTP: existingUser.resetToken,
      providedOTP: otp,
      tokenExpiry: existingUser.resetTokenExpiry,
      currentTime: new Date()
    });

    if (!existingUser.resetToken || String(existingUser.resetToken).trim() !== String(otp).trim()) {
      console.log('OTP mismatch:', { 
        stored: existingUser.resetToken, 
        provided: otp,
        storedType: typeof existingUser.resetToken,
        providedType: typeof otp,
        storedLength: String(existingUser.resetToken).length,
        providedLength: String(otp).length
      });
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (!existingUser.resetTokenExpiry || existingUser.resetTokenExpiry < new Date()) {
      console.log('OTP expired:', { expiry: existingUser.resetTokenExpiry, now: new Date() });
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    console.log('Password reset successfully for:', email);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
