"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
// 🔹 Get all payments for the logged-in user
router.get("/", authMiddleware_1.default, paymentController_1.getPayments);
// 🔹 Get payment summary (today, week, month, totals)
router.get("/summary", authMiddleware_1.default, paymentController_1.getPaymentSummary);
// 🔹 Record a new payment
router.post("/", authMiddleware_1.default, paymentController_1.makePayment);
exports.default = router;
