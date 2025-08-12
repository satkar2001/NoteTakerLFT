import express from 'express';
import { register, login } from '../controllers/authController.js';
import { googleAuth, getGoogleAuthUrl } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/google/url', getGoogleAuthUrl);

export default router;
