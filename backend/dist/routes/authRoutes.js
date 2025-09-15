"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created" });
    }
    catch (err) {
        if (err &&
            typeof err === "object" &&
            "code" in err &&
            err.code === 11000 // MongoDB duplicate key error
        ) {
            res.status(400).json({ error: "User already exists" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // ✅ Fix: ensure JWT_SECRET is always a string
        const jwtSecret = process.env.JWT_SECRET || "dev_secret_key";
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, {
            expiresIn: "1d",
        });
        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
