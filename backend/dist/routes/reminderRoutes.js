"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Reminder_1 = __importDefault(require("../models/Reminder"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Get reminders
router.get("/", authMiddleware_1.default, async (req, res) => {
    const reminders = await Reminder_1.default.find({ userId: req.user.id });
    res.json(reminders);
});
// Add reminder
router.post("/", authMiddleware_1.default, async (req, res) => {
    const { title, amount, dueDate } = req.body;
    const reminder = new Reminder_1.default({ title, amount, dueDate, userId: req.user.id });
    await reminder.save();
    res.status(201).json(reminder);
});
exports.default = router;
