import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Account from '../models/Account';
import { generateAccountNumber } from '../middleware';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Related Routes
 */
/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Registering a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     accountNumber:
 *                       type: string
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 */

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      success: false,
      status_code: 400,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email already exists',
        status_code: 409,
        status: 'error',
        success: false,
      });
    }

    const user = new User({ name, email, password });
    await user.save();

    const accountNumber = generateAccountNumber();
    const account = new Account({ accountNumber, userId: user._id });
    await account.save();

    user.accounts.push(account.accountNumber);
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      status_code: 201,
      status: 'success',
      success: true,
      data: {
        userId: user._id,
        accountNumber,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Logging in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     userId:
 *                      type: string
 *                 status_code:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 */

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      status_code: 400,
      success: false,
      message: errors.array()[0].msg,
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Invalid credentials',
        status_code: 401,
        status: 'error',
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.json({
      success: true,
      status_code: 200,
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};
