import { Request, Response } from 'express';
import Reminder from '../models/Reminder.js';

export const markAsPaid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Marking payment as paid for ID: ${id}`);
    const reminder = await Reminder.findById(id);

    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found' });
      return;
    }

    reminder.isPaid = true;
    await reminder.save();

    res.status(200).json({
      message: 'Payment marked as paid.',
      reminder: {
        id: reminder._id,
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        isPaid: reminder.isPaid,
        paymentId: reminder.paymentId, // ✅ include paymentId
      },
    });
  } catch (err) {
    console.error('Error marking payment as paid:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const setReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, amount, dueDate, userId } = req.body;

    const reminder = new Reminder({
      title: title || type,
      amount,
      dueDate,
      userId,
      email: '', // Add email if required from frontend
      recurrence: 'reminder',
      isPaid: false,
      createdAt: new Date(),
    });

    await reminder.save();

    res.status(201).json({
      message: 'Reminder created successfully.',
      reminder: {
        id: reminder._id,
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        isPaid: reminder.isPaid,
        paymentId: reminder.paymentId, // ✅ include paymentId
        createdAt: reminder.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to set reminder.' });
  }
};

export const getPendingPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const pending = await Reminder.find({ isPaid: false }).sort({ dueDate: 1 });
    res.status(200).json(pending);
  } catch (err) {
    console.error('Error fetching pending payments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOverduePayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const overdue = await Reminder.find({
      isPaid: false,
      dueDate: { $lt: now },
    });

    const enriched = overdue.map((p) => ({
      id: p._id,
      name: p.title,
      amount: p.amount,
      dueDate: p.dueDate,
      paymentId: p.paymentId, // ✅ optional
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching overdue payments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUpcomingPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const upcoming = await Reminder.find({
      isPaid: false,
      dueDate: { $gte: now },
    });

    const enriched = upcoming.map((p) => {
      const dueDate = new Date(p.dueDate);
      const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: p._id,
        name: p.title,
        amount: p.amount,
        dueDate: p.dueDate,
        overdueDays: daysLeft < 0 ? Math.abs(daysLeft) : 0,
        paymentId: p.paymentId, // ✅ optional
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching upcoming payments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
