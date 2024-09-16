import { Response, NextFunction } from 'express';
import User from '../models/User';
import Account from '../models/Account';
import { AuthRequest } from '../middleware';
import { generateAccountNumber } from '../middleware';

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account Related Routes
 */

/**
 * @swagger
 * /api/v1/accounts:
 *   post:
 *     summary: Creating an Account for an existing user
 *     tags: [Account]
 *     responses:
 *       201:
 *         description: Account created successfully
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

export const createAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        status_code: 404,
        status: 'error',
      });
    }

    if (user.accounts.length >= 4) {
      return res.status(400).json({
        message: 'Maximum number of accounts reached',
        success: false,
        status_code: 400,
        status: 'error',
      });
    }

    const accountNumber = generateAccountNumber();
    const account = new Account({ accountNumber, userId: user._id });
    await account.save();

    user.accounts.push(account.accountNumber);
    await user.save();

    res.status(201).json({
      message: 'Account created successfully',
      success: true,
      status_code: 201,
      status: 'success',
      data: { accountNumber },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/accounts/{accountNumber}:
 *   get:
 *     summary: Search for an account details with account number
 *     tags: [Account]
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *          type: string
 *          description: Account number to search for
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
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
 *                     name:
 *                       type: string
 *                 status_code:
 *                   type: integer
 *                   example: 200
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

export const searchAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const account = await Account.findOne({ accountNumber: req.params.accountNumber });
    if (!account) {
      return res.status(404).json({
        message: 'Account not found',
        success: false,
        status_code: 404,
        status: 'error',
      });
    }

    const user = await User.findById(account.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        status_code: 404,
        status: 'error',
      });
    }

    res.json({
      success: true,
      status: 'success',
      message: 'Account details retrieved successfully',
      data: {
        name: user.name,
      },
      status_code: 200,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Getting all users associated account
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: User accounts retrieved successfully
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
 *                     accounts:
 *                       type: list
 *                 status_code:
 *                   type: integer
 *                   example: 200
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

export const getUserAccounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const accounts = await Account.find({ userId: req.user._id })
      .select('accountNumber balance -_id')
      .sort({ accountNumber: 1 });

    res.json({
      message: 'User accounts retrieved successfully',
      success: true,
      status_code: 200,
      status: 'success',
      data: {
        userId: req.user._id,
        accounts: accounts,
      },
    });
  } catch (error) {
    next(error);
  }
};
