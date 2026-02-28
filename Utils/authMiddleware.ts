import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || '';
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('JWT Verification error:', errorMessage);
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export default authenticateToken;
