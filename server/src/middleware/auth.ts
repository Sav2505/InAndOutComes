import type { NextFunction, Request, Response } from 'express';
import { sessions } from '../sessions.js';

declare global {
  namespace Express {
    interface Request {
      user: { id: string; name: string };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = header.slice(7);
  const session = sessions.get(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = session;
  next();
};
