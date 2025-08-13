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
app.get('/auth/google/callback', (req: Request, res: Response) => {
  const { code, scope } = req.query;
  
  if (!code) {
    return res.status(400).json({ 
      success: false, 
      error: 'Authorization code is required' 
    });
  }
  
  // Redirect to frontend with the authorization code
  const frontendUrl = process.env.NODE_ENV === 'production'
    ? 'https://notetaker-frontend.onrender.com'
    : 'http://localhost:5173';
    
  res.redirect(`${frontendUrl}/auth/google/callback?code=${code}&scope=${scope}`);
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
