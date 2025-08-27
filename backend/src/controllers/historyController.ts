import { Request, Response } from 'express';
import History from '../models/History';

// ✅ GET /api/history — Fetch all history entries
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await History.find().sort({ date: -1 }); // optional: sort latest first
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Failed to fetch payment history.' });
  }
};

// ✅ Already existing
export const savePaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, description, amount, status } = req.body;

    if (!date || !description || amount === undefined || !status) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      res.status(400).json({ message: 'Amount must be a valid number.' });
      return;
    }

    const newPayment = new History({
      date: new Date(date),
      description,
      amount: parsedAmount,
      status,
    });

    const saved = await newPayment.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
