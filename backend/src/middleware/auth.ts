import { Request, Response, NextFunction } from 'express';
import { findUserById } from '../data/mockData';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: 'Employee' | 'Manager';
        name: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ success: false, error: 'Access token required' });
    return;
  }

  // In a real app, you'd verify the JWT token here
  // For this mock implementation, we'll use the token as the user ID
  const user = findUserById(token);
  
  if (!user) {
    res.status(403).json({ success: false, error: 'Invalid token' });
    return;
  }

  req.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email
  };

  next();
};

export const requireManager = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'Manager') {
    res.status(403).json({ success: false, error: 'Manager access required' });
    return;
  }

  next();
};
