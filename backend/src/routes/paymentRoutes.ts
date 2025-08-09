// backend/src/routes/paymentRoutes.ts
import { Router } from 'express';
import {
  getPendingPayments,
  setReminder, markAsPaid,
  getOverduePayments,
  getUpcomingPayments
} from '../controllers/paymentController.ts'; // ✅ must be `.ts`

const router = Router();

router.get('/pending', getPendingPayments);
router.get('/upcoming', getUpcomingPayments);
router.post('/reminder', setReminder);
router.get('/overdue', getOverduePayments);
router.patch('/:id/mark-paid', markAsPaid);

export default router;



