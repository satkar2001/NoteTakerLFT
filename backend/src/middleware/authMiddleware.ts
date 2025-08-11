import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev_secret_key';

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
  return res.status(401).json({ error: 'Unauthorized: token missing' });
}

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;

    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    (req as any).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
