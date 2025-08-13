import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { specs } from './config/swagger.js';
import prisma from './lib/prismaClient.js';

const app: Application = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://notetaker-frontend.onrender.com', 
      ]
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NoteTaker API Documentation'
}));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Google OAuth callback route - must be before /api routes
app.get('/auth/google/callback', async (req: Request, res: Response) => {
  const { code, scope } = req.query;
  
  if (!code) {
    return res.status(400).json({ 
      success: false, 
      error: 'Authorization code is required' 
    });
  }
  
  try {
    // Process the authorization code with Google
    const { OAuth2Client } = await import('google-auth-library');
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    // Exchange code for tokens
    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);
    
    // Get user info
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({ error: 'Google client ID not configured' });
    }
    
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: googleClientId
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(500).json({ error: 'Failed to get user payload' });
    }
    
    const { email, name, picture, sub: googleId } = payload;
    
    if (!email) {
      return res.status(500).json({ error: 'Email not provided by Google' });
    }
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          googleId,
          avatar: picture || null
        }
      });
    } else if (!user.googleId) {
      // Link existing account
      user = await prisma.user.update({
        where: { email },
        data: { 
          googleId, 
          avatar: picture || null 
        }
      });
    }
    
    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }
    
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: '1d' }
    );
    
    // Redirect to frontend with success
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? 'https://notetaker-frontend.onrender.com'
      : 'http://localhost:5173';
      
    res.redirect(`${frontendUrl}/auth/google/callback?success=true&token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name }))}`);
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    // Redirect to frontend with error
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? 'https://notetaker-frontend.onrender.com'
      : 'http://localhost:5173';
      
    res.redirect(`${frontendUrl}/auth/google/callback?error=${encodeURIComponent('Google authentication failed')}`);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.use(notFound);

app.use(errorHandler);

export default app;
