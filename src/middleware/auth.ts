import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User';

import config from '../config/config';

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accounts: string[];
}

export interface AuthRequest extends Request {
  user: IUser;
}

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.JWT_SECRET as string, async (err: any, decoded: any) => {
    if (err)
      res.status(401).json({
        status_code: '401',
        message: 'Invalid token',
      });

    const user: IUser = await User.findOne({ _id: decoded['userId'] });

    if (!user) {
      return res.status(401).json({
        status_code: '401',
        message: 'Invalid token',
      });
    }
    req.user = user;
    next();
  });
};

export function generateAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
