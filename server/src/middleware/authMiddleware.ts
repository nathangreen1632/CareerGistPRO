import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id ?? decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      console.warn('⚠️ Token expired');
      res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('❌ JWT verification failed:', err);
      res.status(403).json({ error: 'Invalid token' });
    }
  }
};
