import express from 'express';
import { savePaymentHistory, getPaymentHistory } from '../controllers/historyController.js';

const router = express.Router();

router.post('/history', savePaymentHistory);

// ✅ Add this:
router.get('/history', getPaymentHistory);

export default router;

