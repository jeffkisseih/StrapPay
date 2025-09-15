"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayments = exports.getPaymentSummary = exports.makePayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Reminder_1 = __importDefault(require("../models/Reminder"));
const Payment_1 = __importDefault(require("../models/Payment"));
const makePayment = async (req, res) => {
    try {
        const { reminderId, amount } = req.body;
        // ✅ Validate input
        if (!reminderId || !amount) {
            return res.status(400).json({ error: "Reminder ID and amount are required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(reminderId)) {
            return res.status(400).json({ error: "Invalid reminder ID format" });
        }
        const paymentAmount = Number(amount);
        if (paymentAmount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than 0" });
        }
        // ✅ Find reminder
        const reminder = await Reminder_1.default.findOne({ _id: reminderId, userId: req.user.id });
        if (!reminder) {
            return res.status(404).json({ error: "Reminder not found" });
        }
        // ✅ Create payment record
        const payment = new Payment_1.default({
            reminderId,
            userId: req.user.id,
            amount: paymentAmount,
            date: new Date(),
        });
        await payment.save();
        // ✅ Update reminder progress
        reminder.amountPaid = (reminder.amountPaid || 0) + paymentAmount;
        // If fully paid, mark as paid
        if (reminder.amountPaid >= reminder.amount) {
            reminder.isPaid = true;
        }
        await reminder.save();
        return res.status(201).json({
            message: reminder.isPaid
                ? "✅ Payment successful — reminder fully paid!"
                : `💳 Payment successful — Remaining: $${reminder.amount - reminder.amountPaid}`,
            payment,
            reminder,
        });
    }
    catch (err) {
        console.error("Payment error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.makePayment = makePayment;
const getPaymentSummary = async (req, res) => {
    const userId = req.user.id;
    const payments = await Payment_1.default.find({ userId });
    const reminders = await Reminder_1.default.find({ userId });
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const paymentsCount = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const remindersToday = reminders.filter(r => new Date(r.dueDate) >= startOfDay).length;
    const remindersThisWeek = reminders.filter(r => new Date(r.dueDate) >= startOfWeek).length;
    const remindersThisMonth = reminders.filter(r => new Date(r.dueDate) >= startOfMonth).length;
    res.json({ paymentsCount, remindersToday, remindersThisWeek, remindersThisMonth, totalAmount });
};
exports.getPaymentSummary = getPaymentSummary;
const getPayments = async (req, res) => {
    try {
        const payments = await Payment_1.default.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(payments);
    }
    catch (error) {
        console.error("❌ Error fetching payments:", error);
        res.status(500).json({ message: "Server error fetching payments" });
    }
};
exports.getPayments = getPayments;
