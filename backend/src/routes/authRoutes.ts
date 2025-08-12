import express from 'express';
import { register, login } from '../controllers/authController.js';
import { googleAuth, getGoogleAuthUrl } from '../controllers/googleAuthController.js';
import { validateUser, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateUser, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.get('/google/url', getGoogleAuthUrl);

export default router;
