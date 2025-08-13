"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleAuthUrl = exports.googleAuth = void 0;
const google_auth_library_1 = require("google-auth-library");
const prismaClient_js_1 = __importDefault(require("../lib/prismaClient.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
const googleAuth = async (req, res) => {
    try {
        const { code } = req.body;
        // Exchange code for tokens
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
        // Get user info
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            return res.status(500).json({ error: 'Google client ID not configured' });
        }
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
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
        let user = await prismaClient_js_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            user = await prismaClient_js_1.default.user.create({
                data: {
                    email,
                    name: name || null,
                    googleId,
                    avatar: picture || null
                }
            });
        }
        else if (!user.googleId) {
            // Link existing account
            user = await prismaClient_js_1.default.user.update({
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Google authentication failed' });
    }
};
exports.googleAuth = googleAuth;
const getGoogleAuthUrl = (req, res) => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    });
    res.json({ url });
};
exports.getGoogleAuthUrl = getGoogleAuthUrl;
//# sourceMappingURL=googleAuthController.js.map