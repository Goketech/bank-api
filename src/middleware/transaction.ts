import { body, param } from 'express-validator';

export const validateTransfer = [
  body('fromAccount')
    .isString()
    .isLength({ min: 10, max: 10 })
    .withMessage('From account number must be 10 digits long'),
  body('toAccount')
    .isString()
    .isLength({ min: 10, max: 10 })
    .withMessage('To account number must be 10 digits long'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom((value) => value > 0)
    .withMessage('Amount must be greater than 0'),
];

export const validateTransactionHistory = [
  param('accountNumber')
    .isString()
    .isLength({ min: 10, max: 10 })
    .withMessage('Account number must be 10 digits long'),
];
