import express from 'express';
import { createAccount, searchAccount, getUserAccounts } from '../controllers';
import { authenticateToken } from '../middleware/auth';

const account = express.Router();

account.post('/', authenticateToken, createAccount);
account.get('/', authenticateToken, getUserAccounts);
account.get('/:accountNumber', searchAccount);

export { account };
