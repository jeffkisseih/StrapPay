import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from '../config/db.js';
import reminderRoutes from '../routes/reminderRoutes.js'
import paymentRoutes from '../routes/paymentRoutes.js';
import historyRoutes from '../routes/historyRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/reminders' , reminderRoutes)
app.use('/api/payments', paymentRoutes);
app.use('/api/history', historyRoutes);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err);
});


