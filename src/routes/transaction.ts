import express from 'express';
import { transfer, getTransactionHistory, getAllUserTransactions } from '../controllers';
import { authenticateToken } from '../middleware';

const transaction = express.Router();

transaction.post('/', authenticateToken, transfer);
transaction.get('/', authenticateToken, getAllUserTransactions);
transaction.get('/:accountNumber', authenticateToken, getTransactionHistory);

export { transaction };
