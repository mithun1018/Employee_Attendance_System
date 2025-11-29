import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

interface RequestWithUser extends Request {
  user?: any;
}

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });

    const token = auth.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'changeme';
    const decoded: any = jwt.verify(token, secret);
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    (req as RequestWithUser).user = user.toJSON ? user.toJSON() : user;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
