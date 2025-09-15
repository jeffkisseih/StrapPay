import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import reminderRoutes from "./routes/reminderRoutes";
import authRoutes from "./routes/authRoutes";
import paymentRoutes from "./routes/paymentRoutes";


const allowedOrigins = [
  "https://your-frontend-domain.vercel.app", // replace after frontend deploy
  "http://localhost:5173"
];



dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
app.use("/api/reminders", reminderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
