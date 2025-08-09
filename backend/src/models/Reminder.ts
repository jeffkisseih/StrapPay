import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReminder extends Document {
  userId: string;
  title: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  recurrence: string;
  email: string;
  createdAt: Date;
  paymentId: string;
}

const reminderSchema: Schema<IReminder> = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  recurrence: { type: String, default: 'none' }, // You can use enum here if needed
  email: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    paymentId: {
    type: String,
    required: true,
    unique: true,
    default: () => `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // ✅ generates unique payment ID
  },
});



const Reminder: Model<IReminder> = mongoose.model<IReminder>('Reminder', reminderSchema);

export default  Reminder ;