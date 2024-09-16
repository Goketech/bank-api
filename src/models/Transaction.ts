import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  description?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  fromAccount: { type: String, required: true },
  toAccount: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

export async function TransactionHistory(accountNumber: string): Promise<ITransaction[]> {
  return Transaction.find({
    $or: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
  }).sort({ createdAt: -1 });
}

export async function createTransaction(
  transactionData: Partial<ITransaction>,
): Promise<ITransaction> {
  const newTransaction = new Transaction(transactionData);
  return newTransaction.save();
}

export async function updateAccountBalance(accountNumber: string, amount: number): Promise<void> {
  const Account = mongoose.model('Account');
  await Account.findOneAndUpdate({ accountNumber }, { $inc: { balance: amount } }, { new: true });
}

export async function performTransfer(
  fromAccount: string,
  toAccount: string,
  amount: number,
  description?: string,
): Promise<ITransaction> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await createTransaction({
      fromAccount,
      toAccount,
      amount,
      type: 'transfer',
      description,
    });

    await updateAccountBalance(fromAccount, -amount);
    await updateAccountBalance(toAccount, amount);

    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
