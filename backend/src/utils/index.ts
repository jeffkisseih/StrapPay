import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/db.js';
import reminderRoutes from '../routes/reminderRoutes.js';
import paymentRoutes from '../routes/paymentRoutes.js';
import historyRoutes from '../routes/historyRoutes.js';

dotenv.config();
const app = express();

// ✅ Proper CORS setup
app.use(cors({
  origin: [
    'http://localhost:5173',                 // local dev frontend
    'https://strappay-production.up.railway.app' // production frontend
  ],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/reminders', reminderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/history', historyRoutes);

// Connect DB
(async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

// Server
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err);
});
