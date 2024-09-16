import { Response } from 'express';
import Account from '../models/Account';
import Transaction, { performTransfer, TransactionHistory } from '../models/Transaction';
import { AuthRequest } from '../middleware';
import { validationResult } from 'express-validator';

/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction Related Routes
 */
/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Creating a transfer between two accounts
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccount:
 *                 type: string
 *               toAccount:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transfer successful
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
 *                     fromAccount:
 *                       type: string
 *                     toAccount:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     type:
 *                       type: string
 *                     description:
 *                       type: string
 *                     createdAt:
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
 *       403:
 *         description: Forbidden
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
 *                   example: 403
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
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
 *                   example: 404
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

export const transfer = async (req: AuthRequest, res: Response) => {
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
    const { fromAccount, toAccount, amount, description } = req.body;

    const sender = await Account.findOne({ accountNumber: fromAccount });
    const recipient = await Account.findOne({ accountNumber: toAccount });

    if (!sender) {
      return res.status(404).json({
        message: 'Sender account not found',
        status: 'error',
        success: false,
        status_code: 404,
      });
    }

    if (!recipient) {
      return res.status(404).json({
        message: 'Receiver account not found',
        status: 'error',
        success: false,
        status_code: 404,
      });
    }

    if (sender.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to transfer from this account',
        status: 'error',
        success: false,
        status_code: 403,
      });
    }

    if (sender.balance < amount) {
      return res.status(400).json({
        message: 'Insufficient funds',
        status: 'error',
        success: false,
        status_code: 400,
      });
    }

    const transaction = await performTransfer(fromAccount, toAccount, amount, description);

    res.json({
      message: 'Transfer successful',
      success: true,
      status: 'success',
      status_code: 201,
      data: {
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Transfer failed',
      error: error.message,
      status: 'error',
      success: false,
      status_code: 400,
    });
  }
};

/**
 * @swagger
 * /api/v1/transactions/{accountNumber}:
 *   get:
 *     summary: Getting transaction history of an account
 *     tags: [Transaction]
 *     parameters:
 *      - name: accountNumber
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountNumber:
 *                       type: string
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                            fromAccount:
 *                              type: string
 *                            toAccount:
 *                              type: string
 *                            amount:
 *                              type: number
 *                            type:
 *                              type: string
 *                            description:
 *                              type: string
 *                            createdAt:
 *                              type: string
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
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
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
 *                   example: 404
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
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 */

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { accountNumber } = req.params;
    const account = await Account.findOne({ accountNumber, userId: req.user._id });

    if (!account) {
      return res.status(404).json({
        status: 'error',
        success: false,
        status_code: 404,
        message: 'Account not found or you are not authorized to view its history',
      });
    }

    const transactions = await TransactionHistory(accountNumber);

    res.json({
      message: 'Transaction history retrieved successfully',
      success: true,
      status: 'success',
      status_code: 200,
      data: {
        accountNumber,
        transactions: transactions.map((t) => ({
          fromAccount: t.fromAccount,
          toAccount: t.toAccount,
          amount: t.amount,
          type: t.type,
          description: t.description,
          createdAt: t.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not fetch Transaction details',
      error: error.message,
      status: 'error',
      success: false,
      status_code: 500,
    });
  }
};



/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Get all transactions for the authenticated user across all accounts
 *     tags: [Transaction]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: accountNumber
 *        in: path
 *        required: true
 *     responses:
 *       200:
 *         description: User transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                            fromAccount:
 *                              type: string
 *                            toAccount:
 *                              type: string
 *                            amount:
 *                              type: number
 *                            type:
 *                              type: string
 *                            description:
 *                              type: string
 *                            createdAt:
 *                              type: string
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
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
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
 *                   example: 404
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
 *                 status_code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 */
export const getAllUserTransactions = async (req: AuthRequest, res: Response) => {
    try {
  
      const userAccounts = await Account.find({ userId: req.user._id });
  
      if (userAccounts.length === 0) {
        return res.status(404).json({
          status: 'error',
          success: false,
          status_code: 404,
          message: 'No accounts found for this user',
        });
      }
  
      const accountNumbers = userAccounts.map(account => account.accountNumber);
  
      const transactions = await Transaction.find({
        $or: [
          { fromAccount: { $in: accountNumbers } },
          { toAccount: { $in: accountNumbers } }
        ]
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        message: 'All user transactions retrieved successfully',
        success: true,
        status: 'success',
        status_code: 200,
        data: {
          transactions: transactions.map((t) => ({
            fromAccount: t.fromAccount,
            toAccount: t.toAccount,
            amount: t.amount,
            type: t.type,
            description: t.description,
            createdAt: t.createdAt,
          })),
        },
      });
    } catch (error) {
      console.error('Error in getAllUserTransactions:', error);
      res.status(500).json({
        message: 'Could not fetch user transactions',
        error: error.message,
        status: 'error',
        success: false,
        status_code: 500,
      });
    }
  };
