import { Request, Response } from 'express';
import Reminder from '../models/Reminder.js'; // ✅ Use `.js` for ESM if you're using `--loader ts-node/esm`



export const createReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, amount, dueDate } = req.body;

    const reminder = await Reminder.create({
      title: type,
      amount,
      dueDate,
      isPaid: false,
      userId: 'test-user',
      recurrence: 'none',
      email: 'test@example.com',
      createdAt: new Date(),
    });

    res.status(201).json(reminder);
  } catch (err:any) {
    console.error('❌ Error in createReminder:', err);
    res.status(500).json({ message: 'Server error', error: err.message || err });
  }
};



export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminders = await Reminder.find();
    console.log('📦 Reminders fetched:', reminders.length);
    res.json(reminders);
  } catch (err: any) {
    console.error('❌ Error in getReminders:', err);
    res.status(500).json({ message: 'Error fetching reminders', error: err.message || err });
  }
};

export const getReminderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found' });
      return;
    }
    res.json(reminder);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching reminder', error: err.message || err });
  }
};

export const updateReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found' });
      return;
    }
    res.json(reminder);
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating reminder', error: err.message || err });
  }
};

export const deleteReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found' });
      return;
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting reminder', error: err.message || err });
  }
};
