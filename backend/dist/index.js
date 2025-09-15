"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const reminderRoutes_1 = __importDefault(require("./routes/reminderRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const allowedOrigins = [
    "https://your-frontend-domain.vercel.app", // replace after frontend deploy
    "http://localhost:5173"
];
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
// Routes
app.use("/api/reminders", reminderRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
// Start server
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)();
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
