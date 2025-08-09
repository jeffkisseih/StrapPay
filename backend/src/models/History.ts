import mongoose, { Document, Schema } from 'mongoose';

export interface IHistory extends Document {
  date: Date;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending';
}

const historySchema = new Schema<IHistory>({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Completed', 'Pending'], required: true },
});

const History = mongoose.model<IHistory>('History', historySchema);
export default History;
