"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReminders = exports.createReminder = void 0;
const Reminder_js_1 = __importDefault(require("../models/Reminder.js"));
const createReminder = async (req, res) => {
    try {
        const reminder = new Reminder_js_1.default(req.body);
        await reminder.save();
        res.status(201).json(reminder);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: errorMessage });
    }
};
exports.createReminder = createReminder;
// reminderController.ts
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder_js_1.default.find({ userId: req.user.id });
        const updated = reminders.map((r) => {
            // ✅ Explicitly cast values to numbers for TypeScript
            const amountPaid = Number(r.amountPaid);
            const amount = Number(r.amount);
            const isPaid = amountPaid >= amount;
            return { ...r.toObject(), isPaid };
        });
        res.json(updated);
    }
    catch (err) {
        console.error("Error fetching reminders:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getReminders = getReminders;
