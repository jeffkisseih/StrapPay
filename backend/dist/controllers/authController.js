"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        // hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // save user
        const user = new User_1.default({ email, password: hashedPassword });
        await user.save();
        return res.status(201).json({ message: "Signup successful" });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.signupUser = signupUser;
