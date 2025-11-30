import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
}
