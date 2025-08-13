import express, { type Router, type Request, type Response } from 'express';
import { register, login } from '../controllers/authController.js';
import { googleAuth, getGoogleAuthUrl } from '../controllers/googleAuthController.js';
import { validateUser, validateLogin } from '../middleware/validationMiddleware.js';

const router: Router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User password (minimum 6 characters)
 *               name:
 *                 type: string
 *                 description: User full name
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.post('/register', validateUser, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Authenticate with Google OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code from Google OAuth
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       500:
 *         description: Google authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/google', googleAuth);

/**
 * @swagger
 * /api/auth/google/url:
 *   get:
 *     summary: Get Google OAuth URL
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google OAuth URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Google OAuth authorization URL
 */
router.get('/google/url', getGoogleAuthUrl);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google OAuth
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *         description: OAuth scope
 *     responses:
 *       200:
 *         description: OAuth callback handled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OAuth callback received"
 *                 code:
 *                   type: string
 *                   description: "Authorization code received"
 *       400:
 *         description: Missing authorization code
 */
router.get('/google/callback', (req: Request, res: Response) => {
  const { code, scope } = req.query;
  
  if (!code) {
    return res.status(400).json({ 
      success: false, 
      error: 'Authorization code is required' 
    });
  }
  
  // For now, just acknowledge the callback
  // In a real implementation, you might want to redirect to frontend with the code
  res.json({ 
    success: true,
    message: 'OAuth callback received',
    code: code as string
  });
});

export default router;
