import { Router } from 'express';
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder
} from '../controllers/reminderController.js'; // Adjust path if needed

const router = Router();

// GET all reminders
router.get('/', getReminders);

// GET a single reminder by ID
router.get('/:id', getReminderById);

// POST a new reminder
router.post('/', createReminder);

// PUT (update) a reminder by ID
router.put('/:id', updateReminder);

// DELETE a reminder by ID
router.delete('/:id', deleteReminder);

export default router;

