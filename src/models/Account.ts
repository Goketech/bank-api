import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  accountNumber: string;
  userId: string;
  balance: number;
}

const AccountSchema: Schema = new Schema({
  accountNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 5000 },
});

export default mongoose.model<IAccount>('Account', AccountSchema);
